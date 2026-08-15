const TIMEZONES = {
  TIJUANA: "America/Tijuana",
  MEXICALI: "America/Tijuana",
  SAN_LUIS_RIO_COLORADO: "America/Hermosillo",
  NOGALES: "America/Hermosillo",
  AGUA_PRIETA: "America/Hermosillo",
  CIUDAD_JUAREZ: "America/Ciudad_Juarez",
  NUEVO_LAREDO: "America/Matamoros",
  REYNOSA: "America/Matamoros",
  MATAMOROS: "America/Matamoros",
  PIEDRAS_NEGRAS: "America/Monterrey",
};

const CLOSING_SOON_MINUTES = 60;

function toMinutes(time) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function format12h(time) {
  const [h, m] = time.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
}

function nowInZone(timeZone) {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const parts = {};
  for (const p of dtf.formatToParts(new Date())) parts[p.type] = p.value;
  const day = new Date(`${parts.year}-${parts.month}-${parts.day}T12:00:00`).getDay();
  const minutes = (Number(parts.hour) % 24) * 60 + Number(parts.minute);
  return { day, minutes };
}

export function getOpenStatus(hours, city) {
  if (!hours || hours.length === 0) {
    return { state: "CLOSED", label: "Horario no disponible" };
  }

  const timeZone = TIMEZONES[city] ?? "America/Tijuana";
  const { day, minutes } = nowInZone(timeZone);
  const today = hours.filter((h) => h.dayOfWeek === day);

  if (today.length === 0) {
    return { state: "CLOSED", label: "Cerrado" };
  }

  let closesAt = null;
  let closingSoon = false;

  for (const h of today) {
    const open = toMinutes(h.opensAt);
    const close = toMinutes(h.closesAt);
    if (minutes >= open && minutes < close) {
      closesAt = h.closesAt;
      if (close - minutes <= CLOSING_SOON_MINUTES) closingSoon = true;
    }
  }

  if (closesAt) {
    if (closingSoon) {
      return { state: "CLOSING_SOON", label: `Cierra pronto · ${format12h(closesAt)}` };
    }
    return { state: "OPEN", label: `Abierto · cierra ${format12h(closesAt)}` };
  }

  return { state: "CLOSED", label: "Cerrado" };
}
