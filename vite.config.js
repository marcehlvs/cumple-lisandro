import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base './' hace que funcione igual en la raíz de un dominio o en una subcarpeta (GitHub Pages).
export default defineConfig({ plugins: [react()], base: './' });
