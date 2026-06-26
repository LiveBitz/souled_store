/**
 * Inventory Utility Functions
 * Handles both old format ("S:10") and new format ("S-Purple:5")
 */

/**
 * Gets total stock from sizes array
 * Supports both formats:
 * - Old: "S:10", "M:15" (size:quantity)
 * - New: "S-Purple:5", "M-Black:8" (size-color:quantity)
 */
export const getTotalStock = (sizes: string[] = []): number => {
  if (!Array.isArray(sizes)) return 0;
  
  return sizes.reduce((total, entry) => {
    if (typeof entry !== 'string' || !entry.includes(":")) return total;
    
    // Extract quantity (always after the last colon)
    const quantity = parseInt(entry.split(":").pop() || "0") || 0;
    return total + (quantity > 0 ? quantity : 0);
  }, 0);
};

/**
 * Checks if product has stock
 */
export const hasStock = (sizes: string[] = []): boolean => {
  return getTotalStock(sizes) > 0;
};

/**
 * SINGLE SOURCE OF TRUTH for a product's available stock.
 * Used by the product card, catalog grid, and filter hook so the listing,
 * the "N products available" count, the filter facets, and the SOLD OUT badge
 * all agree.
 *
 * Availability is driven purely by purchasable VARIANT stock — the same thing
 * the product page uses to enable "Add to Cart". A product with only a legacy
 * `stock` field but no variant quantities cannot actually be bought, so it
 * counts as unavailable.
 *
 *  - Variant array (["S-Black:5", "100ml:3"]) → sum of quantities
 *  - Single variant string ("S:10")          → its quantity
 *  - No variant quantities                    → 0 (unavailable)
 */
export const getProductStock = (product: { sizes?: any; stock?: number }): number => {
  const sizes = product?.sizes;

  if (Array.isArray(sizes)) {
    return getTotalStock(sizes);
  }

  if (typeof sizes === "string" && sizes.includes(":")) {
    return parseInt(sizes.split(":")[1]) || 0;
  }

  return 0;
};

/**
 * Returns the set of colors that have at least one IN-STOCK variant.
 * For legacy products (no color-coded variants) returns all listed colors
 * as long as the product has any stock.
 */
export const getInStockColors = (
  sizes: string[] = [],
  fallbackColors: string[] = [],
  legacyStock = 0
): string[] => {
  const inStock = new Set<string>();
  let hasVariantEntries = false;

  sizes.forEach((entry) => {
    if (typeof entry !== "string" || !entry.includes(":")) return;
    hasVariantEntries = true;
    const qty = parseInt(entry.split(":").pop() || "0") || 0;
    const key = entry.split(":")[0]; // "S-Black" or "100ml"
    if (qty > 0 && key.includes("-")) {
      // color is everything after the first dash (handles "Off-White")
      inStock.add(key.substring(key.indexOf("-") + 1));
    }
  });

  // Legacy / colorless-variant products: surface all colors if there's any stock
  if (!hasVariantEntries) {
    if (legacyStock > 0 || getTotalStock(sizes) > 0) {
      fallbackColors.forEach((c) => inStock.add(c));
    }
  }

  return Array.from(inStock);
};

/**
 * Extracts base size from inventory entry
 * "S-Purple:5" → "S"
 * "S:10" → "S"
 */
export const extractBaseSize = (entry: string): string => {
  if (!entry.includes(":")) return entry;
  const key = entry.split(":")[0];
  return key.includes("-") ? key.split("-")[0] : key;
};

/**
 * Extracts color from inventory entry
 * "S-Purple:5" → "Purple"
 * "S:10" → null (old format)
 */
export const extractColor = (entry: string): string | null => {
  if (!entry.includes(":")) return null;
  const key = entry.split(":")[0];
  if (!key.includes("-")) return null; // Old format
  return key.split("-")[1];
};

/**
 * Gets available colors for a specific size
 * New format only: "S-Purple:5", "S-Black:3" → ["Purple", "Black"]
 */
export const getAvailableColorsForSize = (
  sizes: string[],
  targetSize: string
): string[] => {
  const colors = new Set<string>();
  
  sizes.forEach((entry) => {
    if (!entry.includes(":")) return;
    
    const baseSize = extractBaseSize(entry);
    if (baseSize !== targetSize) return;
    
    const color = extractColor(entry);
    if (color) colors.add(color);
  });
  
  return Array.from(colors);
};

/**
 * Gets all unique base sizes from inventory entries
 * ["S:10", "M:15", "S-Purple:5"] → ["S", "M"]
 */
export const extractBaseSizes = (sizes: string[] = []): string[] => {
  const baseSizes = new Set<string>();
  
  sizes.forEach((entry) => {
    const baseSize = extractBaseSize(entry);
    baseSizes.add(baseSize);
  });
  
  return Array.from(baseSizes);
};

/**
 * Gets all unique colors from inventory entries
 * New format only: ["S-Purple:5", "M-Black:3"] → ["Purple", "Black"]
 */
export const extractColors = (sizes: string[] = []): string[] => {
  const colors = new Set<string>();
  
  sizes.forEach((entry) => {
    const color = extractColor(entry);
    if (color) colors.add(color);
  });
  
  return Array.from(colors);
};

/**
 * Validates inventory entry format
 */
export const isValidInventoryEntry = (entry: string): boolean => {
  if (!entry.includes(":")) return false;
  
  const [key, qtyStr] = entry.split(":");
  if (!key || !qtyStr) return false;
  
  const quantity = parseInt(qtyStr);
  if (isNaN(quantity) || quantity < 0) return false;
  
  return true;
};

/**
 * Validates if all sizes and colors can form a valid inventory matrix
 * Returns { isValid: boolean, errors: string[] }
 */
export const validateInventoryMatrix = (
  sizes: string[],
  colors: string[],
  inventory: Record<string, number>
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  // Check for negative quantities
  Object.entries(inventory).forEach(([_, qty]) => {
    if (qty < 0) {
      errors.push("Inventory quantities cannot be negative");
    }
  });
  
  // Check if all entries have valid format
  Object.keys(inventory).forEach((key) => {
    const parts = key.split("-");
    if (parts.length !== 2) {
      errors.push(`Invalid inventory key format: ${key}`);
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors
  };
};
