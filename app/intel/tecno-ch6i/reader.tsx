"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { FER_PUBLIC_PAGES, ferPageSrc } from "@/lib/fer-ch6i";

export function FerReader() {
  const messageId = useRef<string | null>(null);
  const started = useRef(0);
  const visibleMs = useRef(0);
  const visibleMark = useRef<number | null>(null);
  const lastPost = useRef(0);
  const sessionId = useRef("");

  useEffect(() => {
    sessionId.current = crypto.randomUUID();
    started.current = Date.now();
    visibleMark.current = document.visibilityState === "visible" ? Date.now() : null;
    let stopped = false;

    const checkpoint = () => {
      const now = Date.now();
      if (document.visibilityState === "visible") {
        if (visibleMark.current == null) {
          visibleMark.current = now;
        } else {
          visibleMs.current += now - visibleMark.current;
          visibleMark.current = now;
        }
      } else if (visibleMark.current != null) {
        visibleMs.current += now - visibleMark.current;
        visibleMark.current = null;
      }
    };

    const post = (status: "reading" | "left", force: boolean) => {
      if (stopped && status !== "left") return;
      const now = Date.now();
      if (!force && now - lastPost.current < 20000) return;
      lastPost.current = now;
      checkpoint();
      const body = JSON.stringify({
        action: messageId.current ? "update" : "open",
        messageId: messageId.current,
        sessionId: sessionId.current,
        status,
        visibleSeconds: Math.round(visibleMs.current / 1000),
        openSeconds: Math.round((now - started.current) / 1000),
        referrer: document.referrer || null,
      });

      if (status === "left" && messageId.current) {
        navigator.sendBeacon(
          "/api/intel-read",
          new Blob([body], { type: "application/json" })
        );
        return;
      }

      fetch("/api/intel-read", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        keepalive: true,
      })
        .then((response) => response.json())
        .then((data: { messageId?: string }) => {
          if (data?.messageId) messageId.current = data.messageId;
        })
        .catch(() => {});
    };

    post("reading", true);
    const timer = window.setInterval(() => {
      if (document.visibilityState === "visible") post("reading", false);
    }, 20000);

    const onVisibility = () => {
      post(document.visibilityState === "hidden" ? "left" : "reading", true);
    };
    const onHide = () => post("left", true);

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", onHide);

    return () => {
      stopped = true;
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", onHide);
      onHide();
    };
  }, []);

  return (
    <div className="min-h-screen py-12">
      <section className="py-10">
        <div className="max-w-3xl mx-auto px-4">
          <Link
            href="/intel"
            className="inline-flex items-center gap-2 font-mono text-xs text-primary tracking-widest mb-8 hover:underline"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            INTEL UPDATES
          </Link>

          <p className="font-mono text-xs text-primary tracking-widest mb-4">
            FIELD REPORT · 6 SEP 2026 · FER-2026-0906-TECNO-CH6i
          </p>
          <h1 className="font-heading text-3xl md:text-5xl text-gray-100 tracking-wider mb-4">
            TECNO CAMON <span className="text-primary text-glow-sm">19 NEO</span>
          </h1>
          <p className="text-gray-400 leading-relaxed mb-4">
            Unlocked handset recovered at Otay Mountain. Device forensic report prepared by The GOAT Initiative.
          </p>
          <p className="text-sm text-gray-500 leading-relaxed">
            Some pages are omitted from this public copy.
          </p>
        </div>
      </section>

      <section className="pb-16">
        <div className="max-w-3xl mx-auto px-4 space-y-6">
          {FER_PUBLIC_PAGES.map((page, index) => (
            <figure key={page} className="bg-dark-100/80 border border-gray-800 rounded-sm overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={ferPageSrc(page)}
                alt={`TECNO CH6i forensic report, page ${page}`}
                width={1082}
                height={1400}
                loading={index === 0 ? "eager" : "lazy"}
                className="w-full h-auto bg-white"
              />
              <figcaption className="px-4 py-2 font-mono text-[10px] text-gray-600 tracking-widest">
                PAGE {page}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>
    </div>
  );
}
