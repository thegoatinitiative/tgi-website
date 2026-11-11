"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { RequestAccessButton } from "@/components/RequestAccessButton";
import { IIR_1101_PAGES, iir1101PageSrc } from "@/lib/iir-1101";
import { globeCopy, RouteGlobe } from "./route-globe";

export function IphoneReader() {
  const messageId = useRef<string | null>(null);
  const started = useRef(0);
  const visibleMs = useRef(0);
  const visibleMark = useRef<number | null>(null);
  const lastPost = useRef(0);
  const sessionId = useRef("");
  const [flatMaps, setFlatMaps] = useState<Record<number, boolean>>({});

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
        report: "iphone-11",
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

    const hash = window.location.hash.replace("#", "");
    if (hash) {
      window.setTimeout(
        () => document.getElementById(hash)?.scrollIntoView({ block: hash.startsWith("page-") ? "start" : "center" }),
        50
      );
    }

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
        <div className="max-w-[1114px] mx-auto px-3 sm:px-4">
          <Link
            href="/intel"
            className="inline-flex items-center gap-2 font-mono text-xs text-primary tracking-widest mb-8 hover:underline"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            REPORTS
          </Link>

          <p className="font-mono text-xs text-primary tracking-widest mb-4">
            REPORT · 1 NOV 2026 · TGI-IIR-2026-1101-001
          </p>
          <h1 className="font-heading text-2xl md:text-4xl text-gray-100 tracking-wider leading-tight mb-4 max-w-5xl">
            CHINESE IPHONE FOUND IN THE DESERT NEXT TO THE <span className="text-primary text-glow-sm">BORDER WALL</span>
          </h1>
          <p className="text-gray-400 leading-relaxed">
            Handset recovered off Jewel Valley Road in Boulevard, California, feet from the border wall. Report prepared by The GOAT Initiative.
          </p>
          <p className="mt-4 text-gray-400 leading-relaxed">
            The files that go with this report open on GOAT Intel after staff approve a request. Sign in at{" "}
            <a href="https://goatintel.com/" className="text-primary hover:underline">GOAT Intel</a>.
          </p>
          <RequestAccessButton className="mt-6" />
        </div>
      </section>

      <section className="pb-16">
        <div className="max-w-[1114px] mx-auto px-3 sm:px-4 space-y-6">
          {IIR_1101_PAGES.map((page, index) => {
            if ((page === 3 || page === 4) && !flatMaps[page]) {
              const view = page === 3 ? "world" : "americas";
              const copy = globeCopy(view);
              return (
                <figure key={page} id={page === 3 ? "world-route" : "americas-route"} className="flex min-h-[calc(100vh-6rem)] scroll-mt-24 flex-col items-center justify-center border border-gray-800 bg-[#07111f] px-4 py-10">
                  <span id={`page-${page}`} className="block scroll-mt-24" />
                  <div className="mb-5 max-w-3xl text-center">
                    <p className="font-mono text-sm text-primary tracking-widest">{copy.title}</p>
                    <p className="mt-3 text-lg md:text-xl text-gray-200 leading-relaxed">{copy.note}</p>
                  </div>
                  <RouteGlobe view={view} onFail={() => setFlatMaps((current) => ({ ...current, [page]: true }))} />
                  <figcaption className="mt-5 font-mono text-xs text-gray-400 tracking-widest">
                    PAGE {page}
                  </figcaption>
                </figure>
              );
            }
            return (
            <figure key={page} id={`page-${page}`} className="scroll-mt-24 bg-dark-100/80 border border-gray-800 rounded-sm overflow-x-auto">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={iir1101PageSrc(page)}
                alt={`Chinese iPhone found in the desert next to the border wall, report page ${page}`}
                width={1275}
                height={1650}
                loading={index === 0 ? "eager" : "lazy"}
                className="mx-auto block h-auto w-full max-w-[1082px] bg-[#b6b2ac] brightness-[0.68] sepia-[0.14]"
              />
              <figcaption className="px-4 py-2 font-mono text-[10px] text-gray-600 tracking-widest">
                PAGE {page}
              </figcaption>
            </figure>
            );
          })}
        </div>
      </section>
    </div>
  );
}
