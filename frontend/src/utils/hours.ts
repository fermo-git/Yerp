import type { BusinessHours } from "@/types/business";

export type OpenState = "OPEN" | "CLOSING_SOON" | "CLOSED";

export interface OpenStatus {
  state: OpenState;
  label: string;
}

const CLOSING_SOON_MINUTES = 60;

function toMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

export function formatTime12h(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${m.toString().padStart(2, "0")} ${period}`;
}

export function getOpenStatus(hours: BusinessHours[] | undefined, now = new Date()): OpenStatus {
  if (!hours || hours.length === 0) {
    return { state: "CLOSED", label: "Horario no disponible" };
  }

  const day = now.getDay();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const today = hours.filter((h) => h.dayOfWeek === day);

  if (today.length === 0) {
    return { state: "CLOSED", label: "Cerrado" };
  }

  let closesAt: string | null = null;
  let closingSoon = false;

  for (const h of today) {
    const open = toMinutes(h.opensAt);
    const close = toMinutes(h.closesAt);
    if (nowMinutes >= open && nowMinutes < close) {
      closesAt = h.closesAt;
      if (close - nowMinutes <= CLOSING_SOON_MINUTES) closingSoon = true;
    }
  }

  if (closesAt) {
    if (closingSoon) {
      return { state: "CLOSING_SOON", label: `Cierra pronto · ${formatTime12h(closesAt)}` };
    }
    return { state: "OPEN", label: `Abierto · cierra ${formatTime12h(closesAt)}` };
  }

  return { state: "CLOSED", label: "Cerrado" };
}
