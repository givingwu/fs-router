import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fileBasedRouter from '@feoe/fs-router/vite';

export default defineConfig({
  plugins: [react(), fileBasedRouter()],
  build: { outDir: 'dist/vite' },
});
