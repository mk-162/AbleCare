/* eslint-disable @typescript-eslint/no-explicit-any */

export type CanonicalScheme = "light" | "grey" | "blue" | "aqua" | "black";

/**
 * Some block components ignore `scheme` and render a fixed background.
 * Map them here so adjacency matching still reflects what actually paints.
 */
const FIXED_SCHEME: Record<string, CanonicalScheme> = {
  trustBar: "grey",
  trustCertBlock: "grey",
  teamGrid: "light",
  teamShowcase: "light",
  videoSection: "light",
  emailGateDownload: "grey",
  leadMagnetPromo: "grey",
};

function getBlockType(block: any): string | null {
  if (!block) return null;
  const typename = block.__typename;
  if (typename) {
    const stripped = typename.replace(/^.*Blocks/, "");
    return stripped.charAt(0).toLowerCase() + stripped.slice(1);
  }
  return block._template ?? null;
}

/**
 * Canonical scheme for a block. Normalizes across `scheme` and `colorScheme`
 * fields, collapses "white" into "light", and respects blocks with hardcoded
 * backgrounds that ignore the declared scheme.
 */
export function resolveBlockScheme(block: any): CanonicalScheme {
  if (!block) return "light";

  const blockType = getBlockType(block);
  if (blockType && FIXED_SCHEME[blockType]) return FIXED_SCHEME[blockType];

  const raw = (block.scheme ?? block.colorScheme ?? "").toString().toLowerCase();
  if (raw === "blue") return "blue";
  if (raw === "aqua") return "aqua";
  if (raw === "grey" || raw === "gray") return "grey";
  if (raw === "black") return "black";
  return "light";
}
