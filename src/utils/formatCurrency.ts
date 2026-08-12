const formatter = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  maximumFractionDigits: 0,
});

/** Formatea un precio en pesos mexicanos; `null`/`undefined` -> "Precio a tratar". */
export function formatCurrency(value: number | null | undefined): string {
  if (value === null || value === undefined) return "Precio a tratar";
  return formatter.format(value);
}
