import { defineConfig } from 'cypress';

export default defineConfig({
  watchForFileChanges: false,
  video: false,
  e2e: {
    // @ts-ignore
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
