export type ColorScheme = "blue" | "light" | "aqua" | "grey";

export const colorSchemes: Record<ColorScheme, string> = {
  blue: "bg-ac-blue text-ac-white",
  light: "bg-white text-ac-black",
  aqua: "bg-ac-aqua text-ac-black",
  grey: "bg-ac-grey text-ac-black",
};

export const getSchemeClasses = (scheme: ColorScheme) => colorSchemes[scheme];
