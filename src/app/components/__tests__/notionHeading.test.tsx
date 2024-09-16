import React from 'react';

import { render } from '@testing-library/react';

import Heading from '../notion-blocks/Heading';

describe('notionHeading', () => {
  it('renders heading text correctly', () => {
    const block = {
      type: 'heading_1',
      heading_1: {
        rich_text: [{ plain_text: 'Test heading' }],
      },
    };

    const { getByText } = render(<Heading block={block} />);
    const heading = getByText('Test heading');
    expect(heading).toBeInTheDocument();
    expect(heading.tagName).toBe('SPAN');
  });
});
