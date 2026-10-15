# Invitación Mundial 2026

Invitación de cumpleaños con cuenta regresiva y juego de penales. Al ganar se descarga `public/Invitacion.pdf` sin modificar.

También tiene una trivia de Argentina y los Mundiales (5 preguntas al azar, las preguntas están en `src/trivia.js`) y una sección "Cómo llegar" con botón a Google Maps.

## Uso
```bash
npm install
npm run dev      # desarrollo
npm run build    # genera /dist
```

## Configuración
Todo está en `src/config.js` (fecha, dirección, nombre, número de WhatsApp, nombre del PDF).

## Link por invitado (opcional)
`https://tu-sitio/?i=Sofía` saluda al invitado por su nombre. Sin `?i=` no hay saludo.
