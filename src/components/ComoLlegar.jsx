import { CONFIG } from '../config';

export default function ComoLlegar() {
  if (!CONFIG.direccion) return null;

  const mapa = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    CONFIG.direccionMapa || CONFIG.direccion
  )}`;

  return (
    <section className="card">
      <h2>¿Cómo llegar?</h2>
      <p>
        <strong>{CONFIG.direccion}</strong>
      </p>
      <p>¡Los esperamos a los chicos y a toda la familia!</p>
      <a className="btn btn-primary" href={mapa} target="_blank" rel="noreferrer">
        Abrir en Google Maps
      </a>
    </section>
  );
}
