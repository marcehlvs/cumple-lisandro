import Countdown from './components/Countdown';
import PenaltyGame from './components/PenaltyGame';
import { CONFIG } from './config';

// Saludo opcional: tuapp.com/?i=Sofía muestra "Hola, Sofía". Si no hay parámetro, no se saluda.
function getNombre() {
  const raw = new URLSearchParams(window.location.search).get('i') || '';
  return raw.trim().slice(0, 20);
}

export default function App() {
  const nombre = getNombre();

  return (
    <main className="app">
      <header className="hero">
        <p className="stars" aria-hidden="true">★ ★ ★</p>
        <h1>{CONFIG.nombre.toUpperCase()}</h1>
        <p className="sub">Mis {CONFIG.edad} años</p>
        <p className="date">{CONFIG.fechaTexto}</p>
      </header>

      <Countdown />
      <PenaltyGame nombre={nombre} />
    </main>
  );
}
