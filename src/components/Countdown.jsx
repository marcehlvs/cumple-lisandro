import { useEffect, useState } from 'react';
import { CONFIG } from '../config';

const target = new Date(CONFIG.fecha).getTime();

function calcular() {
  const ms = Math.max(0, target - Date.now());
  const s = Math.floor(ms / 1000);
  return {
    terminada: ms === 0,
    dias: Math.floor(s / 86400),
    horas: Math.floor((s % 86400) / 3600),
    min: Math.floor((s % 3600) / 60),
    seg: s % 60,
  };
}

export default function Countdown() {
  const [t, setT] = useState(calcular);

  useEffect(() => {
    const id = setInterval(() => setT(calcular()), 1000);
    return () => clearInterval(id);
  }, []);

  if (t.terminada) {
    return (
      <section className="countdown">
        <p className="cd-title">¡Llegó el día! El partido ya empezó ⚽</p>
      </section>
    );
  }

  const caja = (valor, etiqueta) => (
    <div className="cd-box">
      <span className="cd-num">{String(valor).padStart(2, '0')}</span>
      <span className="cd-label">{etiqueta}</span>
    </div>
  );

  return (
    <section className="countdown" aria-label="Cuenta regresiva para la fiesta">
      <p className="cd-title">Faltan para el pitazo inicial</p>
      <div className="cd-row">
        {caja(t.dias, 'días')}
        {caja(t.horas, 'horas')}
        {caja(t.min, 'min')}
        {caja(t.seg, 'seg')}
      </div>
    </section>
  );
}
