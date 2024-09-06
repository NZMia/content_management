import React from 'react';

import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';

import Tooltip from '../Tooltip';

describe('Tooltip', () => {
  it('renders children correctly', () => {
    render(
      <Tooltip text="Test tooltip">
        <button>Hover me</button>
      </Tooltip>
    );
    expect(screen.getByText('Hover me')).toBeInTheDocument();
  });

  it('shows tooltip on mouse enter and hides on mouse leave', () => {
    render(
      <Tooltip text="Test tooltip">
        <button>Hover me</button>
      </Tooltip>
    );

    const button = screen.getByText('Hover me');

    // Initially, tooltip should not be visible
    expect(screen.queryByText('Test tooltip')).not.toBeInTheDocument();

    // Show tooltip on mouse enter
    fireEvent.mouseEnter(button);
    expect(screen.getByText('Test tooltip')).toBeInTheDocument();

    // Hide tooltip on mouse leave
    fireEvent.mouseLeave(button);
    expect(screen.queryByText('Test tooltip')).not.toBeInTheDocument();
  });

  it('applies correct styling to the tooltip', () => {
    render(
      <Tooltip text="Test tooltip">
        <button>Hover me</button>
      </Tooltip>
    );

    const button = screen.getByText('Hover me');

    fireEvent.mouseEnter(button);
    const tooltip = screen.getByText('Test tooltip');

    expect(tooltip).toHaveClass('absolute');
    expect(tooltip).toHaveClass('z-10');
    expect(tooltip).toHaveClass('px-2');
    expect(tooltip).toHaveClass('py-1');
    expect(tooltip).toHaveClass('text-sm');
    expect(tooltip).toHaveClass('text-white');
    expect(tooltip).toHaveClass('bg-gray-700');
    expect(tooltip).toHaveClass('rounded-md');
  });
});
