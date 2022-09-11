import { defineConfig } from 'vite';
export default defineConfig({
  define: {
    // @ts-ignore
    APP_VERSION: JSON.stringify(process.env.npm_package_version),
  },
});
