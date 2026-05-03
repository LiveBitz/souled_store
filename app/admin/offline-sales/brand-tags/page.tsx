import { getBrandTags } from "@/app/admin/actions/brand-tags";
import { BrandTagsManager } from "@/components/admin/BrandTagsManager";

export default async function BrandTagsPage() {
  const tags = await getBrandTags();
  return <BrandTagsManager initialTags={tags} />;
}
