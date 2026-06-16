"use client";

import { useState } from "react";
import { CONTACT } from "@/config/site";

export default function CopyEmailButton({ style }: { style?: React.CSSProperties }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${CONTACT.email}`;
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={copied ? "Email copied" : "Copy email address"}
      style={{
        background: "transparent",
        border: "1px solid var(--steel)",
        color: copied ? "#41ff72" : "var(--titanium)",
        fontFamily: "var(--font-mono)",
        fontSize: "10px",
        padding: "4px 10px",
        cursor: "pointer",
        marginTop: "8px",
        ...style,
      }}
    >
      {copied ? "[COPIED]" : "[COPY EMAIL]"}
    </button>
  );
}
