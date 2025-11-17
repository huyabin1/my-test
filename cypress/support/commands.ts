/// <reference types="cypress" />

// Custom commands for testing

Cypress.Commands.add('drawOnCanvas', (startX, startY, endX, endY) => {
  cy.get('[data-testid="canvas"]').then(($canvas) => {
    const canvas = $canvas[0] as HTMLCanvasElement;
    const rect = canvas.getBoundingClientRect();

    const startPosX = rect.left + startX;
    const startPosY = rect.top + startY;
    const endPosX = rect.left + endX;
    const endPosY = rect.top + endY;

    cy.get('[data-testid="canvas"]')
      .trigger('mousedown', startPosX, startPosY)
      .trigger('mousemove', endPosX, endPosY)
      .trigger('mouseup');
  });
});

Cypress.Commands.add('setStrokeWidth', (width) => {
  cy.get('[data-testid="stroke-width"]').invoke('val', width).trigger('change');
});

Cypress.Commands.add('setStrokeColor', (color) => {
  cy.get('[data-testid="stroke-color"]').invoke('val', color).trigger('change');
});

declare global {
  namespace Cypress {
    interface Chainable {
      drawOnCanvas(startX: number, startY: number, endX: number, endY: number): Chainable<void>;
      setStrokeWidth(width: number): Chainable<void>;
      setStrokeColor(color: string): Chainable<void>;
    }
  }
}

export {};
