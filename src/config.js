// Todo lo que cambia de una fiesta a otra está acá.
export const CONFIG = {
  nombre: 'Lisandro',
  edad: 9,
  fechaTexto: 'Sábado 24 de octubre · 20:30 hs',
  // Hora de Argentina (UTC-3). Es la que usa la cuenta regresiva.
  fecha: '2026-10-24T20:30:00-03:00',
  // Lugar de la fiesta. Si queda vacío, no se muestra la sección "Cómo llegar".
  direccion: 'Calle 889 N° 4361',
  // Lo que se busca en Google Maps. Conviene sumarle la localidad para que no se confunda de lugar.
  direccionMapa: 'Calle 889 4361, Buenos Aires, Argentina',
  // Número para confirmar asistencia, con código de país y sin + ni espacios.
  // Ejemplo: '5491112345678'. Si queda vacío, el botón de WhatsApp no se muestra.
  whatsapp: '5491126758365',
  // PDF que está en /public y se descarga sin modificar.
  pdf: 'Invitacion.pdf',
  pdfDescarga: 'Invitacion-Cumple-Lisandro.pdf',
};
