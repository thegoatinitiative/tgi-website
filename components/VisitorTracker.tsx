"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function VisitorTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Don't track in development (optional - remove if you want to test)
    // if (process.env.NODE_ENV === "development") return;

    // Send tracking data
    const trackVisit = async () => {
      try {
        await fetch("/api/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            page: pathname,
            referrer: document.referrer || null,
          }),
        });
      } catch (error) {
        // Silently fail - don't affect user experience
        console.debug("Tracking failed:", error);
      }
    };

    trackVisit();
  }, [pathname]);

  // This component doesn't render anything
  return null;
}
