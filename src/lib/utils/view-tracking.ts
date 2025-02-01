// src/lib/utils/view-tracking.ts
import { v4 as uuidv4 } from "uuid";

export const getVisitorId = () => {
  if (typeof window === "undefined") return null;

  let visitorId = localStorage.getItem("visitorId");
  if (!visitorId) {
    visitorId = uuidv4();
    localStorage.setItem("visitorId", visitorId);
  }
  return visitorId;
};

export const trackView = async (
  targetId: string,
  targetType: "post" | "profile" | "project"
) => {
  const visitorId = getVisitorId();
  if (!visitorId || !targetId) {
    console.log("Missing visitorId or targetId", { visitorId, targetId });
    return;
  }

  try {
    console.log("Tracking view:", { targetId, targetType, visitorId });

    const response = await fetch("/api/views", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-visitor-id": visitorId,
      },
      body: JSON.stringify({ targetId, targetType }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to track view");
    }

    const data = await response.json();
    console.log("View tracked successfully:", data);
  } catch (error) {
    console.error("Error tracking view:", error);
  }
};

import { useEffect } from "react";

export const useTrackView = (
  targetId: string,
  targetType: "post" | "profile" | "project"
) => {
  useEffect(() => {
    if (targetId) {
      trackView(targetId, targetType);
    }
  }, [targetId, targetType]);
};
