/// <reference types="cypress" />
import './commands';

// Cypress commands
Cypress.Commands.add('tab', () => {
  cy.focused().trigger('keydown', { keyCode: 9, which: 9, key: 'Tab' });
});

declare global {
  namespace Cypress {
    interface Chainable {
      tab(): Chainable<void>;
    }
  }
}

export {};
