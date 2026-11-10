"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

const inputClass =
  "w-full bg-dark border border-gray-700 px-4 py-3 text-gray-100 rounded-sm focus:border-primary focus:outline-none";

type Result = { ok?: boolean; error?: string };

function messageFor(result: Result, ok: boolean): { error: string; done: string } {
  if (!ok) {
    if (result.error === "rate") return { error: "Too many attempts. Wait a few minutes and try again.", done: "" };
    if (result.error === "invalid") {
      return {
        error: "Enter your first name, last name, a valid email, a phone number, and your organization.",
        done: "",
      };
    }
    return { error: "We could not send the request. Try again in a minute.", done: "" };
  }
  return { error: "", done: "Request received. Staff will review it and email you if it is approved." };
}

export function PortalForm() {
  const [error, setError] = useState("");
  const [done, setDone] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    setError("");
    setDone("");
    const formEl = event.currentTarget;
    const form = new FormData(formEl);
    setPending(true);
    try {
      const response = await fetch("/api/goatintel/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: form.get("firstName"),
          lastName: form.get("lastName"),
          email: form.get("email"),
          phone: form.get("phone"),
          organization: form.get("organization"),
        }),
      });
      const result = (await response.json().catch(() => ({}))) as Result;
      const next = messageFor(result, response.ok);
      setError(next.error);
      setDone(next.done);
      if (response.ok) formEl.reset();
    } catch {
      setError("We could not send the request. Try again in a minute.");
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      <p className="text-gray-400 leading-relaxed mb-8">
        Tell us who you are and where you work. Staff review each request and email you if it is approved.
        This is separate from a field-report account. After approval, you choose a username and password on GOAT Intel.
      </p>
      <form onSubmit={onSubmit} className="space-y-4 bg-dark-100/80 border border-primary/20 p-6">
        <label className="block">
          <span className="block font-mono text-[10px] text-gray-500 tracking-widest mb-2">FIRST NAME</span>
          <input name="firstName" required autoComplete="given-name" maxLength={80} className={inputClass} />
        </label>
        <label className="block">
          <span className="block font-mono text-[10px] text-gray-500 tracking-widest mb-2">LAST NAME</span>
          <input name="lastName" required autoComplete="family-name" maxLength={80} className={inputClass} />
        </label>
        <label className="block">
          <span className="block font-mono text-[10px] text-gray-500 tracking-widest mb-2">EMAIL</span>
          <input name="email" type="email" required autoComplete="email" maxLength={254} className={inputClass} />
        </label>
        <label className="block">
          <span className="block font-mono text-[10px] text-gray-500 tracking-widest mb-2">PHONE NUMBER</span>
          <input name="phone" type="tel" required autoComplete="tel" inputMode="tel" className={inputClass} />
        </label>
        <label className="block">
          <span className="block font-mono text-[10px] text-gray-500 tracking-widest mb-2">
            DEPARTMENT, AGENCY, OR ORGANIZATION
          </span>
          <input name="organization" required autoComplete="organization" maxLength={120} className={inputClass} />
        </label>
        {error ? <p className="text-sm text-red-300">{error}</p> : null}
        {done ? <p className="text-sm text-gray-200">{done}</p> : null}
        <button
          type="submit"
          disabled={pending}
          className="w-full py-6 bg-primary text-dark font-heading text-xl font-bold tracking-widest disabled:opacity-60 sm:py-7 sm:text-2xl"
        >
          {pending ? "SENDING" : "REQUEST ACCESS"}
        </button>
      </form>
      <p className="text-sm text-gray-500 mt-6">
        Already approved?{" "}
        <a href="https://goatintel.com/" className="text-primary">
          Sign in at GOAT Intel
        </a>
        . Read the{" "}
        <Link href="/privacy" className="text-primary">
          privacy policy
        </Link>
        .
      </p>
    </>
  );
}
