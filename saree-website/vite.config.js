import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // 1. Load the environment variables from .env
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: 'https://api.freepik.com',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, ''),
          // 2. Add the headers option to inject the key
          headers: {
            'x-freepik-api-key': env.VITE_FREEPIK_API_KEY,
          },
        },
      },
    },
  };
});