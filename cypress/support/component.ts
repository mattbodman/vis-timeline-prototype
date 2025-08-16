// ***********************************************************
// This example support/component.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

import './commands'
import { mount } from '@cypress/angular'

// Augment the Cypress namespace to include type definitions for
// your custom command.
// Alternatively, you can place this code inside the test file.
declare global {
  namespace Cypress {
    interface Chainable<Subject = any> {
      mount: typeof mount
    }
  }
}

// @ts-ignore - Cypress Commands namespace issue
Cypress.Commands.add('mount', mount)