import { describe, it, expect } from 'vitest';
import {
  isValidHexColor,
  isValidStrokeWidth,
  isValidZoom,
  clampValue,
  round,
} from '@utils/validators';

describe('validators', () => {
  describe('isValidHexColor', () => {
    it('should validate correct hex colors', () => {
      expect(isValidHexColor('#000000')).toBe(true);
      expect(isValidHexColor('#ffffff')).toBe(true);
      expect(isValidHexColor('#FF00FF')).toBe(true);
    });

    it('should reject invalid hex colors', () => {
      expect(isValidHexColor('000000')).toBe(false);
      expect(isValidHexColor('#00000')).toBe(false);
      expect(isValidHexColor('#0000000')).toBe(false);
      expect(isValidHexColor('red')).toBe(false);
    });
  });

  describe('isValidStrokeWidth', () => {
    it('should validate valid widths', () => {
      expect(isValidStrokeWidth(1)).toBe(true);
      expect(isValidStrokeWidth(10)).toBe(true);
      expect(isValidStrokeWidth(20)).toBe(true);
    });

    it('should reject invalid widths', () => {
      expect(isValidStrokeWidth(0)).toBe(false);
      expect(isValidStrokeWidth(21)).toBe(false);
      expect(isValidStrokeWidth(1.5)).toBe(false);
      expect(isValidStrokeWidth(-1)).toBe(false);
    });
  });

  describe('isValidZoom', () => {
    it('should validate valid zoom levels', () => {
      expect(isValidZoom(0.1)).toBe(true);
      expect(isValidZoom(1)).toBe(true);
      expect(isValidZoom(5)).toBe(true);
    });

    it('should reject invalid zoom levels', () => {
      expect(isValidZoom(0.05)).toBe(false);
      expect(isValidZoom(5.5)).toBe(false);
      expect(isValidZoom(-1)).toBe(false);
    });
  });

  describe('clampValue', () => {
    it('should clamp values within range', () => {
      expect(clampValue(5, 0, 10)).toBe(5);
    });

    it('should clamp values below minimum', () => {
      expect(clampValue(-5, 0, 10)).toBe(0);
    });

    it('should clamp values above maximum', () => {
      expect(clampValue(15, 0, 10)).toBe(10);
    });
  });

  describe('round', () => {
    it('should round to default 2 decimals', () => {
      expect(round(1.234)).toBe(1.23);
    });

    it('should round to specified decimals', () => {
      expect(round(1.2345, 3)).toBe(1.235);
      expect(round(1.2345, 1)).toBe(1.2);
    });

    it('should handle integers', () => {
      expect(round(5, 2)).toBe(5);
    });
  });
});
