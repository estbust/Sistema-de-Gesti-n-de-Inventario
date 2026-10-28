import { defineConfig } from 'vite';

// Configuración para permitir rutas relativas en producción (compatible con GitHub Pages y servidores locales)
export default defineConfig({
  base: './',
});
