import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: { port: 5173, open: true },
  build: {
    chunkSizeWarningLimit: 700,
    rolldownOptions: {
      output: {
        advancedChunks: {
          groups: [
            { name: 'charts', test: /node_modules[\/](recharts|d3-|victory|redux|@reduxjs|immer|reselect)/ },
            { name: 'react', test: /node_modules[\/](react|react-dom|react-router|scheduler)/ },
          ],
        },
      },
    },
  },
});
