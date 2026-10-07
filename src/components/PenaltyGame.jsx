import { useEffect, useMemo, useRef, useState } from 'react';
import { CONFIG } from '../config';

const GOLES_PARA_GANAR = 3; // 3 goles ganan
const ATAJADAS_PARA_PERDER = 3; // 3 atajadas hacen imposible llegar a 3 goles en 5 tiros
const TOTAL_TIROS = 5;

const ETIQUETAS = [
  'arriba a la izquierda',
  'arriba al centro',
  'arriba a la derecha',
  'abajo a la izquierda',
  'abajo al centro',
  'abajo a la derecha',
];

// Centro de cada zona del arco, en % del arco (6 zonas: 3 columnas x 2 alturas).
const COLS = [17, 50, 83];
const FILAS = [32, 72];
const posZona = (z) => ({ x: COLS[z % 3], y: FILAS[Math.floor(z / 3)] });

const PELOTA_INICIO = { x: 50, y: 128, s: 1 };
const ARQUERO_INICIO = { x: 50, y: 62, rot: 0 };

// Sonidos simples con Web Audio: no hace falta ningún archivo.
let audioCtx;
function tono(freqs, dur = 0.14) {
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    freqs.forEach((f, i) => {
      const o = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      o.type = 'square';
      o.frequency.value = f;
      g.gain.value = 0.05;
      o.connect(g).connect(audioCtx.destination);
      const t0 = audioCtx.currentTime + i * dur;
      o.start(t0);
      o.stop(t0 + dur);
    });
  } catch {
    /* sin audio, el juego sigue igual */
  }
}

function Arquero({ x, y, rot }) {
  return (
    <div
      className="keeper"
      style={{ left: `${x}%`, top: `${y}%`, transform: `translate(-50%, -50%) rotate(${rot}deg)` }}
      aria-hidden="true"
    >
      <svg viewBox="-6 0 72 90" width="60" height="90">
        <rect x="17" y="56" width="10" height="28" rx="4" fill="#1f3a6b" />
        <rect x="33" y="56" width="10" height="28" rx="4" fill="#1f3a6b" />
        <rect x="-2" y="20" width="16" height="9" rx="4" fill="#f6b40e" transform="rotate(-35 6 24)" />
        <rect x="46" y="20" width="16" height="9" rx="4" fill="#f6b40e" transform="rotate(35 54 24)" />
        <rect x="14" y="24" width="32" height="36" rx="10" fill="#f6b40e" />
        <circle cx="0" cy="12" r="6" fill="#fff" />
        <circle cx="60" cy="12" r="6" fill="#fff" />
        <circle cx="30" cy="12" r="10" fill="#f2c29b" />
      </svg>
    </div>
  );
}

function Confeti() {
  const piezas = useMemo(
    () =>
      Array.from({ length: 36 }, (_, i) => ({
        left: Math.random() * 100,
        delay: Math.random() * 1.5,
        dur: 2.5 + Math.random() * 2,
        color: ['#75aadb', '#ffffff', '#f6b40e', '#1f3a6b'][i % 4],
      })),
    []
  );
  return (
    <div className="confetti" aria-hidden="true">
      {piezas.map((p, i) => (
        <span
          key={i}
          style={{ left: `${p.left}%`, background: p.color, animationDelay: `${p.delay}s`, animationDuration: `${p.dur}s` }}
        />
      ))}
    </div>
  );
}

export default function PenaltyGame({ nombre }) {
  const [estado, setEstado] = useState('inicio'); // inicio | jugando | ganó | perdió
  const [tiros, setTiros] = useState([]); // 'gol' | 'atajada'
  const [pelota, setPelota] = useState(PELOTA_INICIO);
  const [arquero, setArquero] = useState(ARQUERO_INICIO);
  const [ocupado, setOcupado] = useState(false);
  const [aviso, setAviso] = useState(null); // 'gol' | 'atajada'
  const timers = useRef([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const luego = (fn, ms) => timers.current.push(setTimeout(fn, ms));

  function empezar() {
    setTiros([]);
    setPelota(PELOTA_INICIO);
    setArquero(ARQUERO_INICIO);
    setAviso(null);
    setOcupado(false);
    setEstado('jugando');
    tono([880], 0.2); // silbato
  }

  function patear(zona) {
    if (ocupado || estado !== 'jugando') return;
    setOcupado(true);

    const destino = posZona(zona);
    const zonaArquero = Math.floor(Math.random() * 6);
    const a = posZona(zonaArquero);
    const atajo = zonaArquero === zona;
    const siguiente = [...tiros, atajo ? 'atajada' : 'gol'];

    setPelota({ x: destino.x, y: destino.y, s: 0.6 });
    setArquero({ x: a.x, y: a.y, rot: (a.x - 50) * 1.6 });

    // Cuando llega la pelota: se muestra el resultado.
    luego(() => {
      setAviso(atajo ? 'atajada' : 'gol');
      setTiros(siguiente);
      tono(atajo ? [196, 147] : [523, 659, 784]);
    }, 600);

    // Después: se acomoda todo y se decide si terminó la tanda.
    luego(() => {
      setPelota(PELOTA_INICIO);
      setArquero(ARQUERO_INICIO);
      setAviso(null);
      const goles = siguiente.filter((r) => r === 'gol').length;
      const atajadas = siguiente.length - goles;
      if (goles >= GOLES_PARA_GANAR) setEstado('ganó');
      else if (atajadas >= ATAJADAS_PARA_PERDER) setEstado('perdió');
      setOcupado(false);
    }, 1700);
  }

  const goles = tiros.filter((r) => r === 'gol').length;
  const atajadas = tiros.length - goles;

  if (estado === 'inicio') {
    return (
      <section className="card">
        <h2>¡Definí el Mundial desde los 12 pasos!</h2>
        <p>
          {nombre ? `Hola, ${nombre}. ` : ''}Metele {GOLES_PARA_GANAR} goles en {TOTAL_TIROS} penales y ganás tu entrada
          para el cumple de {CONFIG.nombre}.
        </p>
        <button className="btn btn-primary" onClick={empezar}>¡A patear!</button>
      </section>
    );
  }

  if (estado === 'ganó') {
    const quien = nombre ? `Soy ${nombre}. ` : '';
    const mensaje = `¡Hola! ${quien}Confirmo que voy al cumple de ${CONFIG.nombre} 🎉`;
    const wa = CONFIG.whatsapp ? `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(mensaje)}` : null;

    return (
      <section className="card win">
        <Confeti />
        <p className="stars" aria-hidden="true">★ ★ ★</p>
        <h2>¡Campeón del mundo!</h2>
        <p>
          {nombre ? `${nombre}, ganaste` : 'Ganaste'} tu entrada para el cumple de {CONFIG.nombre}. Descargala y guardala.
        </p>
        <a className="btn btn-gold" href={`${import.meta.env.BASE_URL}${CONFIG.pdf}`} download={CONFIG.pdfDescarga}>
          Descargar mi entrada
        </a>
        {wa && (
          <a className="btn btn-ghost" href={wa} target="_blank" rel="noreferrer">
            Confirmar asistencia por WhatsApp
          </a>
        )}
        <button className="link" onClick={empezar}>Jugar de nuevo</button>
      </section>
    );
  }

  if (estado === 'perdió') {
    return (
      <section className="card">
        <h2>¡Casi!</h2>
        <p>El arquero te atajó {atajadas} penales. Tenés todos los intentos que quieras.</p>
        <button className="btn btn-primary" onClick={empezar}>Revancha</button>
      </section>
    );
  }

  return (
    <section className="card game">
      <div className="stage">
        <div className="area" />
        <div className="spot" />
        <div className="goal">
          <div className="net" />
          <Arquero {...arquero} />
          <div className="zones">
            {ETIQUETAS.map((txt, z) => (
              <button
                key={z}
                className="zone"
                onClick={() => patear(z)}
                disabled={ocupado}
                aria-label={`Patear ${txt}`}
              />
            ))}
          </div>
          <div
            className="ball"
            style={{
              left: `${pelota.x}%`,
              top: `${pelota.y}%`,
              transform: `translate(-50%, -50%) scale(${pelota.s}) rotate(${pelota.s < 1 ? 360 : 0}deg)`,
            }}
            aria-hidden="true"
          >
            ⚽
          </div>
        </div>
        {aviso && <div className={`flash ${aviso}`} role="status">{aviso === 'gol' ? '¡GOOOL!' : '¡Atajó!'}</div>}
      </div>

      <div className="score" aria-label={`Goles: ${goles} de ${GOLES_PARA_GANAR}`}>
        {Array.from({ length: TOTAL_TIROS }, (_, i) => (
          <span key={i} className={`dot ${tiros[i] || ''}`}>
            {tiros[i] === 'gol' ? '⚽' : tiros[i] === 'atajada' ? '✕' : ''}
          </span>
        ))}
      </div>
      <p className="hint">
        {ocupado ? 'Esperá el resultado...' : `Tocá una zona del arco. Goles: ${goles} de ${GOLES_PARA_GANAR}`}
      </p>
    </section>
  );
}
