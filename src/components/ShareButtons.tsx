"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import QRCode from "qrcode";

function linkFor(id: string, baseUrl?: string | null) {
  return `${baseUrl ?? window.location.origin}/s/${id}`;
}

export default function ShareButtons({
  id,
  title,
  baseUrl,
}: {
  id: string;
  title: string;
  baseUrl?: string | null;
}) {
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(linkFor(id, baseUrl));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <>
      <button
        onClick={copy}
        className="rounded-sm bg-navy px-3 py-1.5 font-semibold text-white transition hover:bg-navy-deep active:scale-95"
      >
        {copied ? "Copied ✓" : "Copy link"}
      </button>
      <button
        onClick={() => setShowQr(true)}
        className="rounded-sm border border-line bg-white px-3 py-1.5 font-medium text-navy hover:border-navy"
      >
        QR code
      </button>
      {showQr && (
        <QrModal
          id={id}
          title={title}
          baseUrl={baseUrl}
          onClose={() => setShowQr(false)}
        />
      )}
    </>
  );
}

function QrModal({
  id,
  title,
  baseUrl,
  onClose,
}: {
  id: string;
  title: string;
  baseUrl?: string | null;
  onClose: () => void;
}) {
  const [svg, setSvg] = useState("");
  const url = linkFor(id, baseUrl);

  useEffect(() => {
    QRCode.toString(url, {
      type: "svg",
      margin: 1,
      width: 320,
      color: { dark: "#0b2266", light: "#ffffff" },
    }).then(setSvg);
  }, [url]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal
      aria-label={`QR code for ${title}`}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-navy-deep/70 p-4 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="animate-rise w-full max-w-md rounded-lg border-t-4 border-gold bg-white p-8 text-center text-ink shadow-2xl"
      >
        <Image
          src="/logo.png"
          alt=""
          width={56}
          height={56}
          className="mx-auto mb-3 rounded-full"
        />
        <p className="text-sm font-medium text-muted">Scan to give feedback</p>
        <h3 className="mt-2 text-2xl font-bold text-navy text-balance">
          {title}
        </h3>
        <div
          className="mx-auto mt-6 aspect-square w-full max-w-[320px] [&_svg]:h-full [&_svg]:w-full"
          dangerouslySetInnerHTML={{ __html: svg }}
        />
        <p className="mt-4 break-all text-sm text-muted">{url}</p>
        <button
          onClick={onClose}
          className="mt-6 rounded-sm border border-line px-5 py-2 font-medium text-navy hover:border-navy"
        >
          Close
        </button>
      </div>
    </div>
  );
}
