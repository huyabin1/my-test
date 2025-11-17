/**
 * Keyboard utility functions
 */

export const isKeyboardEvent = (event: React.KeyboardEvent): boolean => {
  return event instanceof KeyboardEvent;
};

export const isModifierKey = (event: React.KeyboardEvent): boolean => {
  return event.ctrlKey || event.metaKey || event.shiftKey || event.altKey;
};

export const handleKeyboardShortcut = (
  event: React.KeyboardEvent,
  shortcuts: Record<string, () => void>
): void => {
  const key = event.key.toLowerCase();
  const ctrl = event.ctrlKey || event.metaKey;
  const shift = event.shiftKey;
  const alt = event.altKey;

  // Build shortcut string
  const shortcutParts = [];
  if (ctrl) shortcutParts.push('ctrl');
  if (shift) shortcutParts.push('shift');
  if (alt) shortcutParts.push('alt');
  shortcutParts.push(key);
  const shortcutString = shortcutParts.join('+');

  // Try exact match
  if (shortcuts[shortcutString]) {
    event.preventDefault();
    shortcuts[shortcutString]();
    return;
  }

  // Try key only match (case-insensitive)
  if (shortcuts[key]) {
    event.preventDefault();
    shortcuts[key]();
  }
};
