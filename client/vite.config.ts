import { defineConfig } from 'vite';
import Icons from 'unplugin-icons/vite';
import fs from 'fs';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    Icons({
      compiler: 'jsx',
      jsx: 'react',
    }),
  ],
  server: {
    https: {
      key: fs.readFileSync(`localhost-key.pem`),
      cert: fs.readFileSync(`localhost.pem`),
    }
  }
});
