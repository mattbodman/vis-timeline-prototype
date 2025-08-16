import { defineConfig } from 'cypress'

export default defineConfig({
  component: {
    devServer: {
      framework: 'angular',
      bundler: 'webpack'
    },
    specPattern: 'src/**/*.cy.ts',
    viewportWidth: 1200,
    viewportHeight: 800,
    video: false,
    screenshotOnRunFailure: false
  },
  e2e: {
    baseUrl: 'http://localhost:4200'
  }
})