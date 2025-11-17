import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Tooltip } from '@components/Tooltip';

describe('Tooltip', () => {
  it('should render tooltip trigger', () => {
    render(
      <Tooltip content="Test tooltip">
        <button>Hover me</button>
      </Tooltip>
    );
    expect(screen.getByText('Hover me')).toBeInTheDocument();
  });

  it('should render tooltip content', () => {
    render(
      <Tooltip content="Test tooltip">
        <button>Hover me</button>
      </Tooltip>
    );
    expect(screen.getByRole('tooltip')).toBeInTheDocument();
    expect(screen.getByRole('tooltip')).toHaveTextContent('Test tooltip');
  });

  it('should support different positions', () => {
    const { rerender } = render(
      <Tooltip content="Test" position="top">
        <button>Top</button>
      </Tooltip>
    );
    expect(screen.getByRole('tooltip').parentElement).toHaveClass('tooltip--top');

    rerender(
      <Tooltip content="Test" position="bottom">
        <button>Bottom</button>
      </Tooltip>
    );
    expect(screen.getByRole('tooltip').parentElement).toHaveClass('tooltip--bottom');

    rerender(
      <Tooltip content="Test" position="left">
        <button>Left</button>
      </Tooltip>
    );
    expect(screen.getByRole('tooltip').parentElement).toHaveClass('tooltip--left');

    rerender(
      <Tooltip content="Test" position="right">
        <button>Right</button>
      </Tooltip>
    );
    expect(screen.getByRole('tooltip').parentElement).toHaveClass('tooltip--right');
  });

  it('should default to top position', () => {
    render(
      <Tooltip content="Test">
        <button>Default</button>
      </Tooltip>
    );
    expect(screen.getByRole('tooltip').parentElement).toHaveClass('tooltip--top');
  });
});
