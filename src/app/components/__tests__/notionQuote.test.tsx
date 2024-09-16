import React from 'react';

import { render } from '@testing-library/react';

import Quote from '../notion-blocks/Quote';

describe('notionQuote', () => {
  it('renders quote correctly', () => {
    const block = {
      quote: {
        rich_text: [{ plain_text: 'Test quote' }],
      },
    };

    const { getByText } = render(<Quote block={block} />);
    const quote = getByText('Test quote');
    expect(quote).toBeInTheDocument();
    expect(quote.parentElement).toHaveClass('border-l-4');
  });
});
