import type { ReactNode } from "react";
import type { Business } from "@/types/business";

const icon = (children: ReactNode) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4 shrink-0 text-verde"
  >
    {children}
  </svg>
);

function PhoneIcon() {
  return icon(
    <path d="M5 4h4l2 5-2.5 1.5a12 12 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
  );
}

function ChatIcon() {
  return icon(
    <>
      <path d="M21 11.5a8.5 8.5 0 0 1-12.4 7.5L3 21l2-5.6A8.5 8.5 0 1 1 21 11.5z" />
    </>
  );
}

function WebIcon() {
  return icon(
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" />
    </>
  );
}

function MailIcon() {
  return icon(
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </>
  );
}

function PinIcon() {
  return icon(
    <>
      <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0z" />
      <circle cx="12" cy="10" r="3" />
    </>
  );
}

export function ContactCard({ restaurant }: { restaurant: Business }) {
  const phone = restaurant.phone ? restaurant.phone.replace(/\D/g, "") : null;
  const whatsapp = restaurant.whatsapp ? restaurant.whatsapp.replace(/\D/g, "") : null;
  const mapsUrl =
    restaurant.latitude != null && restaurant.longitude != null
      ? `https://www.google.com/maps/search/?api=1&query=${restaurant.latitude},${restaurant.longitude}`
      : null;

  return (
    <div className="rounded-xl border border-ink/10 bg-white p-5">
      <h2 className="font-display text-lg font-bold text-ink">Contacto</h2>

      <div className="mt-4 flex flex-col gap-3.5">
        {phone && (
          <a
            href={`tel:${phone}`}
            className="flex items-center gap-2.5 text-sm text-ink hover:text-verde"
          >
            <PhoneIcon />
            {restaurant.phone}
          </a>
        )}

        {whatsapp && (
          <a
            href={`https://wa.me/${whatsapp}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2.5 text-sm text-ink hover:text-verde"
          >
            <ChatIcon />
            WhatsApp
          </a>
        )}

        {restaurant.website && (
          <a
            href={restaurant.website}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2.5 text-sm text-ink hover:text-verde"
          >
            <WebIcon />
            Sitio web
          </a>
        )}

        {restaurant.email && (
          <a
            href={`mailto:${restaurant.email}`}
            className="flex items-center gap-2.5 text-sm text-ink hover:text-verde"
          >
            <MailIcon />
            {restaurant.email}
          </a>
        )}

        {restaurant.address && (
          <div className="flex items-center gap-2.5 text-sm text-ink">
            <PinIcon />
            <span>{restaurant.address}</span>
          </div>
        )}

        {mapsUrl && (
          <a
            href={mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="ml-6 w-fit text-sm font-semibold text-verde hover:text-verde-deep"
          >
            Cómo llegar →
          </a>
        )}
      </div>
    </div>
  );
}
