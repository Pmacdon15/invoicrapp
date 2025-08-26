import { useEffect, useState } from "react";
import {
  getReferrerData,
  getStoredReferrerData,
  storeReferrerData,
  trackReferrerData,
  type ReferrerData,
} from "@/lib/referrer-utils";

export function useReferrer() {
  const [referrerData, setReferrerData] = useState<ReferrerData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get current referrer data
    const currentData = getReferrerData();

    // Get stored referrer data (first visit)
    const storedData = getStoredReferrerData();

    // Use current data if available, otherwise use stored data
    const data = currentData.source !== "direct" ? currentData : storedData;

    setReferrerData(data);
    setIsLoading(false);

    // Store the data if it's meaningful
    if (currentData.source !== "direct" || currentData.utmSource) {
      storeReferrerData();
    }
  }, []);

  const track = () => {
    trackReferrerData();
  };

  const getSource = () => referrerData?.source || "direct";
  const getMedium = () => referrerData?.medium || "none";
  const getCampaign = () => referrerData?.campaign || "none";
  const getReferrer = () => referrerData?.referrer || null;

  return {
    referrerData,
    isLoading,
    track,
    getSource,
    getMedium,
    getCampaign,
    getReferrer,
  };
}
