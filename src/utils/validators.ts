/**
 * Validation utility functions
 */

export const isValidHexColor = (color: string): boolean => {
  const hexColorRegex = /^#[0-9A-F]{6}$/i;
  return hexColorRegex.test(color);
};

export const isValidStrokeWidth = (width: number): boolean => {
  return width >= 1 && width <= 20 && Number.isInteger(width);
};

export const isValidZoom = (zoom: number): boolean => {
  return zoom >= 0.1 && zoom <= 5;
};

export const clampValue = (value: number, min: number, max: number): number => {
  return Math.max(min, Math.min(max, value));
};

export const round = (value: number, decimals: number = 2): number => {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
};
