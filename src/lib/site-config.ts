/**
 * Site-level configuration for which region this build represents,
 * the other region's URL, and the labels used by the country switcher
 * and geo-mismatch banner.
 *
 * The UK repo (mk-162/able-care-uk) mirrors this file with the values
 * inverted (thisCountry is "GB", otherCountry is "US", otherHref points
 * back to the US site).
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
  // UK site is currently on its Vercel preview URL for internal testing.
  // Update to https://able-care.co.uk (or final UK domain) when the UK
  // site is ready to be linked publicly.
  otherHref: "https://able-care-uk.vercel.app",
};
