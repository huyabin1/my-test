# Drawing Canvas - User Guide

Welcome to the Drawing Canvas application! This guide will help you get started and master all the features.

## Table of Contents

1. [Getting Started](#getting-started)
2. [User Interface Overview](#user-interface-overview)
3. [Drawing Tools](#drawing-tools)
4. [View Modes](#view-modes)
5. [Keyboard Shortcuts](#keyboard-shortcuts)
6. [Tips & Tricks](#tips--tricks)
7. [Troubleshooting](#troubleshooting)

## Getting Started

### Launching the Application

1. Open your web browser
2. Navigate to `http://localhost:3000`
3. You should see the Drawing Canvas interface

### Initial Setup

- **Theme**: The application detects your system preference (light/dark) automatically
- **First Time**: A brief onboarding notification will guide you to start drawing

## User Interface Overview

### Header
The top bar contains:
- **Application Title** - "Drawing Canvas"
- **Theme Switcher** - Toggle between light, dark, and system themes
  - ☀️ Light mode
  - 🌙 Dark mode
  - 💻 System preference

### Toolbar
The main toolbar provides access to all drawing tools:

**Drawing Modes**
- ✏️ **Draw Mode** - Create freehand drawings
- ⬚ **Select Mode** - Select and move elements
- ✎ **Edit Mode** - Edit properties of selected items

**Stroke Settings**
- **Stroke Width** - Adjust line thickness (1-20px)
- **Color Picker** - Choose your drawing color

**Grid & Snapping**
- 🔒 **Snap to Grid** - Toggle precise grid alignment
- **View Mode** - Choose how to view your canvas
  - Normal: Standard view
  - Grid: Visible grid overlay
  - Outline: Show element outlines only

**History**
- ↶ **Undo** - Revert your last action
- ↷ **Redo** - Restore undone actions
- **Export** - Save your drawing

### Canvas
The main drawing area where you create your artwork:
- Large white workspace for drawing
- Responsive to mouse movements
- Supports multi-step undo/redo
- Auto-saves to history

### Status Bar
The bottom bar displays real-time information:
- **Current Mode** - Shows active drawing mode with status indicator
- **Snap Status** - Displays when snap mode is active
- **View Mode** - Current view setting
- **Zoom Level** - Current zoom percentage

## Drawing Tools

### Draw Mode

#### Basic Drawing
1. Click the ✏️ **Draw** button in the toolbar
2. Click and drag on the canvas to draw
3. Release to finish the stroke

#### Stroke Control
- **Width**: Use the slider to adjust stroke thickness
- **Color**: Click the color picker to choose a color
- **Grid Snapping**: Enable 🔒 to snap to a grid for precise alignment

#### Visual Feedback
- Tooltips appear when hovering over tools
- Status indicators show your current mode
- Toast notifications confirm actions

### Select Mode

1. Click the ⬚ **Select** button
2. Click on elements to select them
3. Drag to move selected elements
4. Right-click for options

### Edit Mode

1. Click the ✎ **Edit** button
2. Click elements to edit their properties
3. Modify stroke width, color, and other properties
4. Changes apply in real-time

## View Modes

### Normal View
Default view with clear, clean appearance.

### Grid View
Shows a subtle grid overlay for alignment reference.

### Outline View
Displays element boundaries and structure for precise editing.

To change view modes:
1. Open the **View Mode** dropdown in the toolbar
2. Select desired mode
3. Canvas updates immediately

## Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Undo | `Ctrl+Z` / `Cmd+Z` |
| Redo | `Ctrl+Y` / `Cmd+Y` |
| Draw Mode | `D` |
| Select Mode | `S` |
| Edit Mode | `E` |
| Toggle Snap | `G` |
| Export | `Ctrl+Shift+E` / `Cmd+Shift+E` |
| Zoom In | `Ctrl++` / `Cmd++` |
| Zoom Out | `Ctrl+-` / `Cmd+-` |
| Reset Zoom | `Ctrl+0` / `Cmd+0` |

## Tips & Tricks

### Drawing Efficiently

1. **Use Snap Mode** for precise drawings
2. **Multiple Strokes** - Draw several elements for complex images
3. **Colors** - Plan your color scheme before drawing
4. **Undo Liberally** - Don't worry about mistakes, undo is your friend

### Organizing Your Work

1. **Group Related Elements** - Draw related items together
2. **Use Layers** - Edit mode allows editing individual elements
3. **Name Your Files** - Export with descriptive names

### Performance Tips

1. **Clean Up** - Remove unnecessary elements
2. **Zoom Appropriately** - Don't zoom too far in
3. **Grid Mode** - Use sparingly for better performance

### Accessibility

- All tools are keyboard accessible
- Screen reader support for all UI elements
- Sufficient color contrast for visibility
- Focus indicators for keyboard navigation

## Troubleshooting

### Canvas Not Responding

**Issue**: Canvas doesn't register mouse clicks or drawing

**Solutions**:
1. Ensure you're in Draw mode (✏️ should be highlighted)
2. Try refreshing the page (`F5` or `Cmd+R`)
3. Check your browser console for errors
4. Restart the application

### Drawing Appears Jumpy

**Issue**: Drawing lines are not smooth

**Solutions**:
1. Disable Snap Mode (🔒) if enabled
2. Try changing browsers
3. Close other applications to free up resources
4. Check your mouse/trackpad connection

### Colors Not Saving

**Issue**: Color changes aren't persisting

**Solutions**:
1. Ensure the color picker closed (click elsewhere)
2. Try using hex color codes instead
3. Check browser storage isn't full
4. Clear browser cache and refresh

### Undo/Redo Not Working

**Issue**: Undo/Redo buttons are disabled

**Solutions**:
1. Make sure you've drawn something first
2. Check if you're at the beginning or end of history
3. Try drawing a new stroke to refresh history
4. Refresh the page if stuck

### Notifications Appearing Incorrectly

**Issue**: Toast notifications aren't showing

**Solutions**:
1. Ensure notifications are not muted in browser
2. Check your system notification settings
3. Try a different browser
4. Refresh the page

## Performance Optimization

For best performance:

- Use the latest version of your browser
- Close unused browser tabs
- Disable browser extensions if experiencing issues
- Use a modern computer with at least 4GB RAM

## Keyboard Navigation

Tab through interface elements:
- `Tab` - Move to next element
- `Shift+Tab` - Move to previous element
- `Enter` - Activate buttons
- `Space` - Toggle checkboxes/buttons
- `Arrow Keys` - Navigate dropdowns or sliders

## Getting Help

If you encounter issues:

1. Check this user guide
2. Look for tooltip hints (hover over tools)
3. Check the browser console for errors (`F12`)
4. File an issue on GitHub with:
   - Browser and version
   - Steps to reproduce
   - Screenshots
   - Console errors

## Keyboard Accessibility

The entire application is navigable with keyboard only:

1. **Tab** to move between controls
2. **Enter/Space** to activate buttons
3. **Arrow Keys** to adjust sliders and select options
4. **Alt+Key** shortcuts for menu items

All buttons have visible focus indicators.

---

**Happy Drawing!** 🎨

For more information, visit the [project repository](https://github.com/your-repo/drawing-canvas)
