"use client";

import { useReferrer } from "@/hooks/use-referrer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function ReferrerDebug() {
  const { referrerData, isLoading, getSource, getMedium, getCampaign } =
    useReferrer();

  if (isLoading) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Referrer Data</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Loading...</p>
        </CardContent>
      </Card>
    );
  }

  if (!referrerData) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Referrer Data</CardTitle>
        </CardHeader>
        <CardContent>
          <p>No referrer data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Referrer Data</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-500">Source</label>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline">{getSource()}</Badge>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-500">Medium</label>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline">{getMedium()}</Badge>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-500">Campaign</label>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline">{getCampaign()}</Badge>
          </div>
        </div>

        {referrerData.referrer && (
          <div>
            <label className="text-sm font-medium text-gray-500">
              Referrer URL
            </label>
            <p className="text-sm text-gray-700 mt-1 break-all">
              {referrerData.referrer}
            </p>
          </div>
        )}

        {referrerData.utmSource && (
          <div>
            <label className="text-sm font-medium text-gray-500">
              UTM Source
            </label>
            <p className="text-sm text-gray-700 mt-1">
              {referrerData.utmSource}
            </p>
          </div>
        )}

        {referrerData.utmMedium && (
          <div>
            <label className="text-sm font-medium text-gray-500">
              UTM Medium
            </label>
            <p className="text-sm text-gray-700 mt-1">
              {referrerData.utmMedium}
            </p>
          </div>
        )}

        {referrerData.utmCampaign && (
          <div>
            <label className="text-sm font-medium text-gray-500">
              UTM Campaign
            </label>
            <p className="text-sm text-gray-700 mt-1">
              {referrerData.utmCampaign}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
