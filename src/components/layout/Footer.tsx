import { Link } from "react-router-dom";

const COLUMNS = [
  {
    title: "Explorar",
    links: ["Restaurantes", "Cafeterías", "Turismo", "Hospedaje", "Marketplace"],
  },
  {
    title: "Ciudades",
    links: ["Tijuana", "Mexicali", "Ciudad Juárez", "Nuevo Laredo", "Reynosa"],
  },
  {
    title: "Negocios",
    links: ["Publica tu negocio", "Planes para negocios", "Centro de ayuda"],
  },
  {
    title: "La Frontera",
    links: ["Sobre nosotros", "Términos y condiciones", "Privacidad"],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-carbon/8 bg-white">
      <div className="container-frontera grid grid-cols-2 gap-8 py-14 sm:grid-cols-4">
        {COLUMNS.map((col) => (
          <div key={col.title} className="flex flex-col gap-3">
            <h4 className="font-display text-sm font-semibold text-carbon">{col.title}</h4>
            <ul className="flex flex-col gap-2.5">
              {col.links.map((link) => (
                <li key={link}>
                  <Link to="#" className="text-sm text-carbon/60 hover:text-cactus">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="container-frontera flex flex-col items-center justify-between gap-4 border-t border-carbon/8 py-6 sm:flex-row">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-cactus text-white">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M12 2 3 8v13h6v-7h6v7h6V8L12 2z" fill="currentColor" />
            </svg>
          </span>
          <span className="text-sm text-carbon/60">
            © {new Date().getFullYear()} La Frontera. Hecho en la línea.
          </span>
        </div>
        <div className="flex gap-4 text-sm text-carbon/50">
          <span>MXN</span>
          <span>Español (MX)</span>
        </div>
      </div>
    </footer>
  );
}
