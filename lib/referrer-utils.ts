/**
 * Referrer utilities for tracking and analytics
 */

export interface ReferrerData {
  referrer: string | null;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  source: string;
  medium: string;
  campaign: string;
}

/**
 * Extract referrer information from URL parameters and document referrer
 */
export function getReferrerData(): ReferrerData {
  if (typeof window === "undefined") {
    return {
      referrer: null,
      source: "direct",
      medium: "none",
      campaign: "none",
    };
  }

  const urlParams = new URLSearchParams(window.location.search);
  const documentReferrer = document.referrer;

  // Extract UTM parameters
  const utmSource = urlParams.get("utm_source");
  const utmMedium = urlParams.get("utm_medium");
  const utmCampaign = urlParams.get("utm_campaign");
  const utmTerm = urlParams.get("utm_term");
  const utmContent = urlParams.get("utm_content");

  // Determine source and medium
  let source = "direct";
  let medium = "none";

  if (utmSource) {
    source = utmSource;
    medium = utmMedium || "unknown";
  } else if (documentReferrer) {
    try {
      const referrerUrl = new URL(documentReferrer);
      source = referrerUrl.hostname;

      // Determine medium based on referrer
      if (referrerUrl.hostname.includes("google")) {
        medium = "organic";
      } else if (
        referrerUrl.hostname.includes("facebook") ||
        referrerUrl.hostname.includes("instagram")
      ) {
        medium = "social";
      } else if (
        referrerUrl.hostname.includes("twitter") ||
        referrerUrl.hostname.includes("x.com")
      ) {
        medium = "social";
      } else if (referrerUrl.hostname.includes("linkedin")) {
        medium = "social";
      } else if (referrerUrl.hostname.includes("youtube")) {
        medium = "social";
      } else if (referrerUrl.hostname.includes("tiktok")) {
        medium = "social";
      } else if (referrerUrl.hostname.includes("bing")) {
        medium = "organic";
      } else if (referrerUrl.hostname.includes("yahoo")) {
        medium = "organic";
      } else if (referrerUrl.hostname.includes("duckduckgo")) {
        medium = "organic";
      } else {
        medium = "referral";
      }
    } catch {
      source = "unknown";
      medium = "unknown";
    }
  }

  return {
    referrer: documentReferrer || null,
    utmSource: utmSource || undefined,
    utmMedium: utmMedium || undefined,
    utmCampaign: utmCampaign || undefined,
    utmTerm: utmTerm || undefined,
    utmContent: utmContent || undefined,
    source,
    medium,
    campaign: utmCampaign || "none",
  };
}

/**
 * Store referrer data in localStorage for persistence
 */
export function storeReferrerData(): void {
  if (typeof window === "undefined") return;

  const referrerData = getReferrerData();

  // Only store if we have meaningful referrer data
  if (referrerData.source !== "direct" || referrerData.utmSource) {
    localStorage.setItem("invoicr_referrer_data", JSON.stringify(referrerData));
    localStorage.setItem("invoicr_first_visit", new Date().toISOString());
  }
}

/**
 * Get stored referrer data from localStorage
 */
export function getStoredReferrerData(): ReferrerData | null {
  if (typeof window === "undefined") return null;

  const stored = localStorage.getItem("invoicr_referrer_data");
  return stored ? JSON.parse(stored) : null;
}

/**
 * Track referrer data for analytics
 */
export function trackReferrerData(): void {
  const referrerData = getReferrerData();

  // Store the data
  storeReferrerData();

  // Send to analytics (you can integrate with your analytics service here)
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "page_view", {
      custom_map: {
        referrer_source: referrerData.source,
        referrer_medium: referrerData.medium,
        referrer_campaign: referrerData.campaign,
      },
      referrer_source: referrerData.source,
      referrer_medium: referrerData.medium,
      referrer_campaign: referrerData.campaign,
    });
  }

  // Log for debugging (remove in production)
  console.log("Referrer Data:", referrerData);
}

/**
 * Generate UTM parameters for sharing
 */
export function generateUTMParams(
  source: string,
  medium: string,
  campaign: string,
  content?: string,
  term?: string
): string {
  const params = new URLSearchParams({
    utm_source: source,
    utm_medium: medium,
    utm_campaign: campaign,
  });

  if (content) params.set("utm_content", content);
  if (term) params.set("utm_term", term);

  return params.toString();
}

/**
 * Add UTM parameters to a URL
 */
export function addUTMParams(
  url: string,
  source: string,
  medium: string,
  campaign: string,
  content?: string,
  term?: string
): string {
  const separator = url.includes("?") ? "&" : "?";
  const utmParams = generateUTMParams(source, medium, campaign, content, term);
  return `${url}${separator}${utmParams}`;
}
