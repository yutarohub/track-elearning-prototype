"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const DEBUG_INGEST = "http://127.0.0.1:7625/ingest/93c631da-3f6d-43ba-ba80-3e18c54353f6";

export function DebugRouteLogger() {
  const pathname = usePathname();
  useEffect(() => {
    // #region agent log
    fetch(DEBUG_INGEST, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "335c54" },
      body: JSON.stringify({
        sessionId: "335c54",
        location: "DebugRouteLogger.tsx:layout",
        message: "root layout mounted",
        data: { pathname },
        timestamp: Date.now(),
        hypothesisId: "H1",
      }),
    }).catch(() => {});
    // #endregion
  }, [pathname]);
  return null;
}
