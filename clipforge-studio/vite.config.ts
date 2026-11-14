import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base './' + HashRouter means the app works on any GitHub Pages path
// (user.github.io/repo-name/) with no server-side routing rules.
export default defineConfig({
  base: './',
  plugins: [react()],
  build: { target: 'es2020', sourcemap: false },
});
