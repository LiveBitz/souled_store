// Colors are stored either as a plain name ("Black", "Beige") or, for custom
// picker colors, as "Name|#hex" (e.g. "Sand Beige|#d8c3a5").
//
// The "|" separator is safe: the inventory format ("Size-Color:qty") splits on
// "-" (size↔color) and ":" (↔quantity), neither of which appears in "|" or a hex.

export interface ParsedColor {
  /** Human-readable label shown to users */
  label: string;
  /** A CSS-renderable color value (hex or named) */
  hex: string;
}

export function parseColor(value: string): ParsedColor {
  if (!value) return { label: "", hex: "transparent" };

  if (value.includes("|")) {
    const [label, hex] = value.split("|");
    return { label: (label || hex).trim(), hex: (hex || label).trim() };
  }

  // Plain name — let the browser resolve it (covers white/black/beige/teal/etc.)
  const lower = value.trim().toLowerCase();
  return { label: value.trim(), hex: lower === "white" ? "#ffffff" : lower };
}

/** Compose a stored color value from a picker (hex) + optional name. */
export function makeColorValue(name: string, hex: string): string {
  const cleanName = name.trim().replace(/[|:\-]/g, " ").replace(/\s+/g, " ").trim();
  return cleanName ? `${cleanName}|${hex}` : hex;
}
