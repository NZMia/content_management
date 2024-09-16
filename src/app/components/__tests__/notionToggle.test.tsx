import React from 'react';

import { render, fireEvent } from '@testing-library/react';

import Toggle from '../notion-blocks/Toggle';

describe('notionToggle', () => {
  it('renders toggle correctly and toggles content', () => {
    const block = {
      toggle: {
        rich_text: [{ plain_text: 'Toggle header' }],
        children: [
          {
            type: 'paragraph',
            paragraph: { rich_text: [{ plain_text: 'Toggle content' }] },
          },
        ],
      },
    };

    const { getByText, queryByText } = render(<Toggle block={block} />);
    const header = getByText('Toggle header');
    expect(header).toBeInTheDocument();

    expect(queryByText('Toggle content')).not.toBeInTheDocument();

    fireEvent.click(header);
    expect(getByText('Toggle content')).toBeInTheDocument();

    fireEvent.click(header);
    expect(queryByText('Toggle content')).not.toBeInTheDocument();
  });
});
