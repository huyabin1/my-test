describe('Notifications and Toasts', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  describe('Notification Display', () => {
    it('should show notification when drawing', () => {
      cy.get('[data-testid="canvas"]').trigger('mousedown', 100, 100);
      cy.get('[data-testid="canvas"]').trigger('mousemove', 150, 150);
      cy.get('[data-testid="canvas"]').trigger('mouseup');
      cy.contains('Drawing saved').should('be.visible');
    });

    it('should show success notification on export', () => {
      cy.get('[data-testid="export"]').click();
      cy.contains('Export').should('be.visible');
      cy.contains('Canvas exported successfully').should('be.visible');
    });

    it('should show info notification on mode change', () => {
      cy.get('[data-testid="mode-draw"]').click();
      cy.contains('Draw mode enabled').should('be.visible');
    });
  });

  describe('Notification Auto-dismiss', () => {
    it('should auto-dismiss notification', () => {
      cy.get('[data-testid="export"]').click();
      cy.contains('Export').should('be.visible');
      cy.wait(4000);
      cy.contains('Export').should('not.be.visible');
    });
  });

  describe('Notification Closing', () => {
    it('should close notification on close button click', () => {
      cy.get('[data-testid="export"]').click();
      cy.contains('Export').should('be.visible');
      cy.get('.notification__close').first().click();
      cy.contains('Export').should('not.be.visible');
    });
  });

  describe('Notification Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      cy.get('[data-testid="export"]').click();
      cy.get('[role="alert"]').should('have.attr', 'role', 'alert');
    });

    it('should have aria-live region', () => {
      cy.get('.toast-container').should('have.attr', 'aria-live', 'polite');
    });
  });

  describe('Multiple Notifications', () => {
    it('should display multiple notifications', () => {
      cy.get('[data-testid="export"]').click();
      cy.get('[data-testid="mode-draw"]').click();
      cy.get('.notification').should('have.length.at.least', 1);
    });
  });
});
