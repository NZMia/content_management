import React from 'react';

import { render, fireEvent, screen } from '@testing-library/react';

import Toggle from '../notion-blocks/Toggle';

jest.mock('../notion-blocks/Paragraph', () => ({ block }: { block: any }) => (
  <div data-testid="mock-paragraph">
    {block.paragraph.rich_text[0].plain_text}
  </div>
));
jest.mock('../notion-blocks/Heading', () => ({ block }: { block: any }) => (
  <div data-testid="mock-heading">
    {block.heading_1.rich_text[0].plain_text}
  </div>
));
jest.mock('../notion-blocks/Code', () => ({ block }: { block: any }) => (
  <div data-testid="mock-code">{block.code.rich_text[0].plain_text}</div>
));
jest.mock('../notion-blocks/Quote', () => ({ block }: { block: any }) => (
  <div data-testid="mock-quote">{block.quote.rich_text[0].plain_text}</div>
));
jest.mock('../notion-blocks/Callout', () => ({ block }: { block: any }) => (
  <div data-testid="mock-callout">{block.callout.rich_text[0].plain_text}</div>
));
jest.mock(
  '../notion-blocks/BulletedListItem',
  () =>
    ({ block }: { block: any }) => (
      <div data-testid="mock-bulleted-list-item">
        {block.bulleted_list_item.rich_text[0].plain_text}
      </div>
    )
);

describe('Toggle component', () => {
  const mockBlock = {
    toggle: {
      rich_text: [{ plain_text: 'Toggle Header' }],
      children: [
        {
          type: 'paragraph',
          paragraph: { rich_text: [{ plain_text: 'Paragraph content' }] },
        },
        {
          type: 'heading_1',
          heading_1: { rich_text: [{ plain_text: 'Heading content' }] },
        },
        { type: 'code', code: { rich_text: [{ plain_text: 'Code content' }] } },
        {
          type: 'quote',
          quote: { rich_text: [{ plain_text: 'Quote content' }] },
        },
        {
          type: 'callout',
          callout: { rich_text: [{ plain_text: 'Callout content' }] },
        },
        {
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [{ plain_text: 'Bulleted list item content' }],
          },
        },
        {
          type: 'unknown_type',
          unknown_type: { rich_text: [{ plain_text: 'Unknown content' }] },
        },
      ],
    },
  };

  it('renders toggle header correctly', () => {
    render(<Toggle block={mockBlock} />);
    expect(screen.getByText('Toggle Header')).toBeInTheDocument();
  });

  it('toggles content visibility when clicked', () => {
    render(<Toggle block={mockBlock} />);
    const summary = screen.getByText('Toggle Header');

    expect(screen.queryByTestId('mock-paragraph')).not.toBeInTheDocument();
    fireEvent.click(summary);
    expect(screen.getByTestId('mock-paragraph')).toBeInTheDocument();
    fireEvent.click(summary);
    expect(screen.queryByTestId('mock-paragraph')).not.toBeInTheDocument();
  });

  it('renders all supported block types', () => {
    render(<Toggle block={mockBlock} />);
    fireEvent.click(screen.getByText('Toggle Header'));

    expect(screen.getByTestId('mock-paragraph')).toHaveTextContent(
      'Paragraph content'
    );
    expect(screen.getByTestId('mock-heading')).toHaveTextContent(
      'Heading content'
    );
    expect(screen.getByTestId('mock-code')).toHaveTextContent('Code content');
    expect(screen.getByTestId('mock-quote')).toHaveTextContent('Quote content');
    expect(screen.getByTestId('mock-callout')).toHaveTextContent(
      'Callout content'
    );
    expect(screen.getByTestId('mock-bulleted-list-item')).toHaveTextContent(
      'Bulleted list item content'
    );
  });

  it('logs unsupported block types', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    render(<Toggle block={mockBlock} />);
    fireEvent.click(screen.getByText('Toggle Header'));

    expect(consoleSpy).toHaveBeenCalledWith(
      'Unhandled block type:',
      'unknown_type'
    );
    consoleSpy.mockRestore();
  });

  it('handles empty children array', () => {
    const emptyBlock = {
      toggle: {
        rich_text: [{ plain_text: 'Empty Toggle' }],
        children: [],
      },
    };
    render(<Toggle block={emptyBlock} />);
    fireEvent.click(screen.getByText('Empty Toggle'));
    expect(screen.queryByTestId('mock-paragraph')).not.toBeInTheDocument();
  });

  it('handles undefined children', () => {
    const undefinedChildrenBlock = {
      toggle: {
        rich_text: [{ plain_text: 'Undefined Children Toggle' }],
      },
    };
    render(<Toggle block={undefinedChildrenBlock} />);
    fireEvent.click(screen.getByText('Undefined Children Toggle'));
    expect(screen.queryByTestId('mock-paragraph')).not.toBeInTheDocument();
  });
});
