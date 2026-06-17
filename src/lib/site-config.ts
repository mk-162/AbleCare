/**
 * Site-level configuration for which region this build represents,
 * the other region's URL, and the labels used by the country switcher
 * and geo-mismatch banner.
 *
 * The UK repo mirrors this file with the values inverted (thisCountry
 * is "GB", otherCountry is "US", otherHref points back to the US site).
 */

export type CountryCode = "GB" | "US";

export const SITE_CONFIG: {
  thisCountry: CountryCode;
  thisLabel: string;
  thisFlag: string;
  otherCountry: CountryCode;
  otherLabel: string;
  otherFlag: string;
  otherHref: string;
} = {
  thisCountry: "US",
  thisLabel: "United States",
  thisFlag: "/images/flags/us.svg",
  otherCountry: "GB",
  otherLabel: "United Kingdom",
  otherFlag: "/images/flags/uk.svg",
  // UK site is live at its canonical apex domain (able-care.uk).
  otherHref: "https://able-care.uk",
};
