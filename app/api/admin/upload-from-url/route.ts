import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Re-host an external image URL into our own Supabase storage bucket.
// This guarantees the image always renders (no hotlink / referrer / expiry issues)
// exactly like a normally uploaded file.
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: auth, error: authError } = await supabase.auth.getUser();
    if (authError || !auth.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { url } = await request.json();
    if (!url || typeof url !== "string" || !/^https?:\/\/.+/i.test(url)) {
      return NextResponse.json({ error: "A valid image URL is required" }, { status: 400 });
    }

    // Fetch the image server-side, mimicking a real browser so CDNs that block
    // non-browser user-agents (common 403 cause) still serve the image.
    let res: Response;
    try {
      res = await fetch(url, {
        redirect: "follow",
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
          Accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
        },
      });
    } catch {
      return NextResponse.json({ error: "Could not reach that URL" }, { status: 400 });
    }

    if (!res.ok) {
      return NextResponse.json(
        { error: `Source returned ${res.status}. Make sure it's a public, direct image link.` },
        { status: 400 }
      );
    }

    // Some hosts mislabel content-type; fall back to sniffing the extension.
    let contentType = (res.headers.get("content-type") || "").split(";")[0].trim().toLowerCase();
    if (!contentType.startsWith("image/")) {
      const pathMatch = url.split("?")[0].toLowerCase();
      const extGuess = pathMatch.match(/\.(jpe?g|png|webp|gif|avif|svg)$/)?.[1];
      if (extGuess) {
        contentType = `image/${extGuess === "jpg" ? "jpeg" : extGuess}`;
      } else {
        return NextResponse.json(
          { error: "That URL is not a direct image (right-click the image → Copy image address)." },
          { status: 400 }
        );
      }
    }

    const arrayBuffer = await res.arrayBuffer();
    // Guard against absurdly large files (10MB)
    if (arrayBuffer.byteLength > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "Image is larger than 10MB" }, { status: 400 });
    }

    const ext = (contentType.split("/")[1] || "jpg").split("+")[0].replace("jpeg", "jpg");
    const fileName = `products/url-${Math.random().toString(36).substring(2)}-${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("product")
      .upload(fileName, arrayBuffer, { contentType, cacheControl: "3600", upsert: false });

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message || "Upload failed" }, { status: 500 });
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("product").getPublicUrl(fileName);

    return NextResponse.json({ url: publicUrl });
  } catch (error: any) {
    console.error("upload-from-url error:", error);
    return NextResponse.json({ error: error.message || "Failed to import image" }, { status: 500 });
  }
}
