describe('Theme Switching', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  describe('Light Mode', () => {
    it('should switch to light mode', () => {
      cy.get('[data-testid="theme-light"]').click();
      cy.get('html').should('have.attr', 'data-theme', 'light');
    });

    it('should have light theme active button', () => {
      cy.get('[data-testid="theme-light"]').click();
      cy.get('[data-testid="theme-light"]').should('have.class', 'active');
    });
  });

  describe('Dark Mode', () => {
    it('should switch to dark mode', () => {
      cy.get('[data-testid="theme-dark"]').click();
      cy.get('html').should('have.attr', 'data-theme', 'dark');
    });

    it('should have dark theme active button', () => {
      cy.get('[data-testid="theme-dark"]').click();
      cy.get('[data-testid="theme-dark"]').should('have.class', 'active');
    });
  });

  describe('System Mode', () => {
    it('should switch to system mode', () => {
      cy.get('[data-testid="theme-system"]').click();
      cy.get('[data-testid="theme-system"]').should('have.class', 'active');
    });
  });

  describe('Theme Persistence', () => {
    it('should persist theme selection', () => {
      cy.get('[data-testid="theme-dark"]').click();
      cy.reload();
      cy.get('[data-testid="theme-dark"]').should('have.class', 'active');
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      cy.get('[data-testid="theme-light"]').parent().should('have.attr', 'role', 'toolbar');
    });

    it('should be keyboard navigable', () => {
      cy.get('body').tab();
      // Verify focus is on one of the theme buttons
      cy.focused().parent().should('have.class', 'tooltip');
    });
  });
});
