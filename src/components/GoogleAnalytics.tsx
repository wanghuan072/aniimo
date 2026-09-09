"use client";

import { useEffect } from "react";

const measurementId = "G-E01MQKVEZ4";

export function GoogleAnalytics() {
  useEffect(() => {
    const timer = window.setTimeout(() => {
      const win = window as typeof window & {
        dataLayer?: unknown[];
        gtag?: (...args: unknown[]) => void;
      };

      if (document.querySelector(`script[src*="googletagmanager.com/gtag/js?id=${measurementId}"]`)) return;

      win.dataLayer = win.dataLayer || [];
      win.gtag = (...args: unknown[]) => win.dataLayer!.push(args);
      win.gtag("js", new Date());
      win.gtag("config", measurementId);

      const script = document.createElement("script");
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
      document.head.appendChild(script);
    }, 10000);

    return () => window.clearTimeout(timer);
  }, []);

  return null;
}
