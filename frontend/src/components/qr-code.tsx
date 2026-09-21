"use client";

/**
 * Simple QR Code component using a free QR API.
 * Falls back to a styled placeholder if image fails.
 */
export function QRCode({ value, size = 128 }: { value: string; size?: number }) {
  // Use goqr.me free API — no key needed
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(value)}&bgcolor=ffffff&color=1a1a2e&format=svg`;

  return (
    <div
      className="bg-white rounded-lg p-2 inline-flex items-center justify-center"
      style={{ width: size + 16, height: size + 16 }}
    >
      <img
        src={qrUrl}
        alt={`QR: ${value.slice(0, 12)}...`}
        width={size}
        height={size}
        className="rounded"
        onError={(e) => {
          // Fallback: show the ticket ID as text
          const target = e.target as HTMLImageElement;
          target.style.display = "none";
          const fallback = target.nextElementSibling as HTMLDivElement;
          if (fallback) fallback.style.display = "flex";
        }}
      />
      <div
        className="hidden flex-col items-center justify-center text-center"
        style={{ width: size, height: size }}
      >
        <div className="text-[8px] font-mono text-gray-600 break-all leading-tight">
          {value}
        </div>
      </div>
    </div>
  );
}
