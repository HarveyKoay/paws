import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const REPO_NAME = 'paws';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
  base: `/${REPO_NAME}/`,
})
