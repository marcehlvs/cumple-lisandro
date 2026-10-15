import { useState } from 'react';
import { PREGUNTAS } from '../trivia';

const POR_RONDA = 5;

function mezclar(lista) {
  const a = [...lista];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Elige POR_RONDA preguntas al azar y mezcla las opciones de cada una.
function armarRonda() {
  return mezclar(PREGUNTAS)
    .slice(0, POR_RONDA)
    .map((p) => ({
      ...p,
      opciones: mezclar(p.opciones.map((texto, i) => ({ texto, ok: i === p.correcta }))),
    }));
}

function mensajeFinal(aciertos) {
  if (aciertos === POR_RONDA) return '¡Perfecto! Sos campeón del mundo de la trivia.';
  if (aciertos >= 3) return '¡Muy bien! Casi te llaman a la selección.';
  return '¡Buen intento! Con un poco de práctica llegás lejos.';
}

export default function Trivia() {
  const [estado, setEstado] = useState('inicio'); // inicio | jugando | fin
  const [ronda, setRonda] = useState([]);
  const [indice, setIndice] = useState(0);
  const [elegida, setElegida] = useState(null);
  const [aciertos, setAciertos] = useState(0);

  function empezar() {
    setRonda(armarRonda());
    setIndice(0);
    setElegida(null);
    setAciertos(0);
    setEstado('jugando');
  }

  function elegir(i) {
    if (elegida !== null) return;
    setElegida(i);
    if (ronda[indice].opciones[i].ok) setAciertos((a) => a + 1);
  }

  function siguiente() {
    if (indice + 1 >= ronda.length) {
      setEstado('fin');
    } else {
      setIndice(indice + 1);
      setElegida(null);
    }
  }

  if (estado === 'inicio') {
    return (
      <section className="card">
        <h2>¡Tiempo suplementario!</h2>
        <p>
          {POR_RONDA} preguntas sobre Argentina y los Mundiales. Es un bonus para jugar en familia: la entrada se gana
          con los penales.
        </p>
        <button className="btn btn-primary" onClick={empezar}>Jugar la trivia</button>
      </section>
    );
  }

  if (estado === 'fin') {
    return (
      <section className="card">
        <h2>
          {aciertos} de {ronda.length}
        </h2>
        <p>{mensajeFinal(aciertos)}</p>
        <button className="btn btn-primary" onClick={empezar}>Jugar de nuevo</button>
      </section>
    );
  }

  const p = ronda[indice];
  const respondida = elegida !== null;
  const acerto = respondida && p.opciones[elegida].ok;
  const correcta = p.opciones.find((o) => o.ok);

  return (
    <section className="card trivia">
      <p className="trivia-progreso">Pregunta {indice + 1} de {ronda.length}</p>
      <h2 className="trivia-pregunta">{p.pregunta}</h2>

      <div className="trivia-opciones">
        {p.opciones.map((o, i) => {
          let clase = 'btn btn-ghost opcion';
          if (respondida && o.ok) clase += ' ok';
          else if (respondida && i === elegida) clase += ' mal';
          return (
            <button key={o.texto} className={clase} onClick={() => elegir(i)} disabled={respondida}>
              {o.texto}
            </button>
          );
        })}
      </div>

      <div className="trivia-resultado" role="status" aria-live="polite">
        {respondida && (
          <>
            <p className="trivia-veredicto">{acerto ? '¡Correcto!' : `Era: ${correcta.texto}`}</p>
            <p>{p.dato}</p>
          </>
        )}
      </div>

      {respondida && (
        <button className="btn btn-gold" onClick={siguiente}>
          {indice + 1 >= ronda.length ? 'Ver mi resultado' : 'Siguiente'}
        </button>
      )}
    </section>
  );
}
