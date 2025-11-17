describe('Drawing Application', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('[data-testid="app"]').should('be.visible');
  });

  describe('UI Elements', () => {
    it('should display the application header', () => {
      cy.contains('Drawing Canvas').should('be.visible');
    });

    it('should display the toolbar', () => {
      cy.get('[role="toolbar"]').should('be.visible');
    });

    it('should display the canvas', () => {
      cy.get('[data-testid="canvas"]').should('be.visible');
    });

    it('should display the status bar', () => {
      cy.get('[role="contentinfo"]').should('be.visible');
    });
  });

  describe('Drawing Operations', () => {
    it('should draw on canvas', () => {
      cy.get('[data-testid="canvas"]').trigger('mousedown', 100, 100);
      cy.get('[data-testid="canvas"]').trigger('mousemove', 150, 150);
      cy.get('[data-testid="canvas"]').trigger('mouseup');
    });

    it('should change stroke width', () => {
      cy.get('[data-testid="stroke-width"]').invoke('val', 5).trigger('change');
      cy.get('[data-testid="stroke-width"]').should('have.value', '5');
    });

    it('should change stroke color', () => {
      cy.get('[data-testid="stroke-color"]').invoke('val', '#ff0000').trigger('change');
      cy.get('[data-testid="stroke-color"]').should('have.value', '#ff0000');
    });
  });

  describe('Modes', () => {
    it('should switch to select mode', () => {
      cy.get('[data-testid="mode-select"]').click();
      cy.get('[data-testid="mode-select"]').should('have.class', 'active');
    });

    it('should switch to edit mode', () => {
      cy.get('[data-testid="mode-edit"]').click();
      cy.get('[data-testid="mode-edit"]').should('have.class', 'active');
    });

    it('should return to draw mode', () => {
      cy.get('[data-testid="mode-select"]').click();
      cy.get('[data-testid="mode-draw"]').click();
      cy.get('[data-testid="mode-draw"]').should('have.class', 'active');
    });
  });

  describe('Snap Mode', () => {
    it('should toggle snap mode', () => {
      cy.get('[data-testid="snap-mode"]').click();
      cy.get('[data-testid="snap-mode"]').should('have.class', 'active');
    });

    it('should toggle snap mode off', () => {
      cy.get('[data-testid="snap-mode"]').click();
      cy.get('[data-testid="snap-mode"]').click();
      cy.get('[data-testid="snap-mode"]').should('not.have.class', 'active');
    });
  });

  describe('View Mode', () => {
    it('should change view mode to grid', () => {
      cy.get('[data-testid="view-mode"]').select('grid');
      cy.get('[data-testid="view-mode"]').should('have.value', 'grid');
    });

    it('should change view mode to outline', () => {
      cy.get('[data-testid="view-mode"]').select('outline');
      cy.get('[data-testid="view-mode"]').should('have.value', 'outline');
    });

    it('should change view mode back to normal', () => {
      cy.get('[data-testid="view-mode"]').select('grid');
      cy.get('[data-testid="view-mode"]').select('normal');
      cy.get('[data-testid="view-mode"]').should('have.value', 'normal');
    });
  });

  describe('Undo/Redo', () => {
    it('should undo action', () => {
      cy.get('[data-testid="canvas"]').trigger('mousedown', 100, 100);
      cy.get('[data-testid="canvas"]').trigger('mousemove', 150, 150);
      cy.get('[data-testid="canvas"]').trigger('mouseup');
      cy.get('[data-testid="undo"]').should('not.be.disabled');
      cy.get('[data-testid="undo"]').click();
    });

    it('should redo action', () => {
      cy.get('[data-testid="canvas"]').trigger('mousedown', 100, 100);
      cy.get('[data-testid="canvas"]').trigger('mousemove', 150, 150);
      cy.get('[data-testid="canvas"]').trigger('mouseup');
      cy.get('[data-testid="undo"]').click();
      cy.get('[data-testid="redo"]').should('not.be.disabled');
      cy.get('[data-testid="redo"]').click();
    });

    it('should disable undo when no history', () => {
      cy.get('[data-testid="undo"]').should('be.disabled');
    });
  });

  describe('Export', () => {
    it('should show export success notification', () => {
      cy.get('[data-testid="export"]').click();
      cy.contains('Export').should('be.visible');
    });
  });

  describe('Tooltips', () => {
    it('should show tooltip on hover', () => {
      cy.get('[data-testid="mode-draw"]').parent().trigger('mouseenter');
      cy.get('[role="tooltip"]').should('be.visible');
    });
  });

  describe('Status Indicators', () => {
    it('should display mode in status bar', () => {
      cy.contains('Mode: Draw').should('be.visible');
    });

    it('should update mode in status bar when changed', () => {
      cy.get('[data-testid="mode-select"]').click();
      cy.contains('Mode: Select').should('be.visible');
    });

    it('should display snap mode badge when enabled', () => {
      cy.get('[data-testid="snap-mode"]').click();
      cy.contains('Snap Mode').should('be.visible');
    });

    it('should display zoom level', () => {
      cy.contains('Zoom:').should('be.visible');
    });
  });
});
