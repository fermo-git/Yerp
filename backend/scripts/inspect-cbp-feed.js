// backend/scripts/inspect-cbp-feed.js
// Script temporal, solo para explorar el feed y sacar los port_numbers reales.
// Se corre una vez, no es parte del pipeline final.

import { XMLParser } from "fast-xml-parser";

async function main() {
  const res = await fetch("https://bwt.cbp.gov/xml/bwt.xml");
  const xml = await res.text();

  const parser = new XMLParser();
  const data = parser.parse(xml);

  const ports = data.border_wait_time.port;
  const mexicanPorts = ports.filter((p) => p.border === "Mexican Border");

  for (const p of mexicanPorts) {
    console.log(`${p.port_number} — ${p.port_name} / ${p.crossing_name}`);
  }
  console.log(`\nTotal puertos mexicanos: ${mexicanPorts.length}`);
}

main();