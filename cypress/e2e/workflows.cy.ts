describe('Complete Drawing Workflows', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  describe('Drawing Workflow', () => {
    it('should complete a full drawing workflow', () => {
      // Start in draw mode
      cy.get('[data-testid="mode-draw"]').should('have.class', 'active');

      // Change stroke properties
      cy.setStrokeWidth(5);
      cy.setStrokeColor('#ff0000');

      // Draw something
      cy.drawOnCanvas(100, 100, 200, 200);

      // Verify drawing was saved
      cy.contains('Drawing saved').should('be.visible');

      // Enable snap mode
      cy.get('[data-testid="snap-mode"]').click();
      cy.contains('Snap Mode').should('be.visible');

      // Draw another shape
      cy.drawOnCanvas(250, 250, 350, 350);

      // Export
      cy.get('[data-testid="export"]').click();
      cy.contains('Export').should('be.visible');
    });

    it('should handle undo/redo during drawing', () => {
      // Draw something
      cy.drawOnCanvas(100, 100, 200, 200);
      cy.contains('Drawing saved').should('be.visible');

      // Undo should be enabled
      cy.get('[data-testid="undo"]').should('not.be.disabled');

      // Undo
      cy.get('[data-testid="undo"]').click();

      // Redo should be enabled
      cy.get('[data-testid="redo"]').should('not.be.disabled');

      // Redo
      cy.get('[data-testid="redo"]').click();
    });

    it('should switch between drawing modes', () => {
      // Draw in draw mode
      cy.drawOnCanvas(100, 100, 150, 150);

      // Switch to select mode
      cy.get('[data-testid="mode-select"]').click();
      cy.get('[data-testid="mode-select"]').should('have.class', 'active');
      cy.contains('Mode: Select').should('be.visible');

      // Switch to edit mode
      cy.get('[data-testid="mode-edit"]').click();
      cy.get('[data-testid="mode-edit"]').should('have.class', 'active');
      cy.contains('Mode: Edit').should('be.visible');

      // Back to draw mode
      cy.get('[data-testid="mode-draw"]').click();
      cy.get('[data-testid="mode-draw"]').should('have.class', 'active');
    });

    it('should maintain drawing across view mode changes', () => {
      // Draw something
      cy.drawOnCanvas(100, 100, 200, 200);

      // Change view mode
      cy.get('[data-testid="view-mode"]').select('grid');
      cy.get('[data-testid="view-mode"]').should('have.value', 'grid');

      // Draw more
      cy.drawOnCanvas(250, 250, 300, 300);

      // Change back to normal
      cy.get('[data-testid="view-mode"]').select('normal');
      cy.get('[data-testid="view-mode"]').should('have.value', 'normal');
    });
  });

  describe('Theme Switching Workflow', () => {
    it('should maintain drawing state across theme changes', () => {
      // Draw something
      cy.drawOnCanvas(100, 100, 200, 200);

      // Switch theme
      cy.get('[data-testid="theme-dark"]').click();
      cy.get('html').should('have.attr', 'data-theme', 'dark');

      // Verify UI is still functional
      cy.get('[data-testid="mode-draw"]').should('be.visible');
      cy.drawOnCanvas(250, 250, 300, 300);

      // Switch back to light
      cy.get('[data-testid="theme-light"]').click();
      cy.get('html').should('have.attr', 'data-theme', 'light');
    });
  });

  describe('Settings Adjustment Workflow', () => {
    it('should remember settings during session', () => {
      // Set stroke properties
      cy.setStrokeWidth(8);
      cy.setStrokeColor('#00ff00');

      // Draw
      cy.drawOnCanvas(100, 100, 200, 200);

      // Settings should persist
      cy.get('[data-testid="stroke-width"]').should('have.value', '8');
      cy.get('[data-testid="stroke-color"]').should('have.value', '#00ff00');

      // Draw again and verify same settings are used
      cy.drawOnCanvas(250, 250, 300, 300);
    });

    it('should allow changing settings mid-session', () => {
      // Initial settings
      cy.setStrokeWidth(2);
      cy.setStrokeColor('#000000');
      cy.drawOnCanvas(100, 100, 150, 150);

      // Change settings
      cy.setStrokeWidth(10);
      cy.setStrokeColor('#ff0000');
      cy.drawOnCanvas(200, 200, 250, 250);

      // Change again
      cy.setStrokeWidth(5);
      cy.setStrokeColor('#0000ff');
      cy.drawOnCanvas(300, 300, 350, 350);
    });
  });

  describe('History Management Workflow', () => {
    it('should handle multiple undo/redo operations', () => {
      // Draw multiple strokes
      cy.drawOnCanvas(50, 50, 100, 100);
      cy.drawOnCanvas(150, 150, 200, 200);
      cy.drawOnCanvas(250, 250, 300, 300);

      // Undo all
      cy.get('[data-testid="undo"]').click();
      cy.get('[data-testid="undo"]').click();
      cy.get('[data-testid="undo"]').click();

      // All redo should be available
      cy.get('[data-testid="redo"]').should('not.be.disabled');

      // Redo all
      cy.get('[data-testid="redo"]').click();
      cy.get('[data-testid="redo"]').click();
      cy.get('[data-testid="redo"]').click();

      // Undo should work again
      cy.get('[data-testid="undo"]').should('not.be.disabled');
    });

    it('should clear redo history when drawing after undo', () => {
      // Draw
      cy.drawOnCanvas(100, 100, 150, 150);

      // Undo
      cy.get('[data-testid="undo"]').click();

      // Redo should be available
      cy.get('[data-testid="redo"]').should('not.be.disabled');

      // Draw new stroke
      cy.drawOnCanvas(200, 200, 250, 250);

      // Redo should now be disabled (history cleared)
      cy.get('[data-testid="redo"]').should('be.disabled');
    });
  });

  describe('Notification System Workflow', () => {
    it('should show notifications for key actions', () => {
      // Draw notification
      cy.drawOnCanvas(100, 100, 150, 150);
      cy.contains('Drawing saved').should('be.visible');

      // Mode change notification
      cy.get('[data-testid="mode-draw"]').click();
      cy.contains('Draw mode enabled').should('be.visible');

      // Export notification
      cy.get('[data-testid="export"]').click();
      cy.contains('Export').should('be.visible');
      cy.contains('Canvas exported successfully').should('be.visible');
    });

    it('should dismiss notifications', () => {
      cy.drawOnCanvas(100, 100, 150, 150);
      cy.contains('Drawing saved').should('be.visible');

      // Close notification
      cy.get('.notification__close').first().click();
      cy.contains('Drawing saved').should('not.be.visible');
    });

    it('should auto-dismiss notifications', () => {
      cy.drawOnCanvas(100, 100, 150, 150);
      cy.contains('Drawing saved').should('be.visible');

      // Wait for auto-dismiss
      cy.wait(3000);
      cy.contains('Drawing saved').should('not.be.visible');
    });
  });
});
