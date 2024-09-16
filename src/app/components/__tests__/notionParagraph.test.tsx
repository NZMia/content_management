import React from 'react';

import { render } from '@testing-library/react';

import Paragraph from '../notion-blocks/Paragraph';

describe('notionParagraph', () => {
  it('renders paragraph text correctly', () => {
    const block = {
      paragraph: {
        rich_text: [{ plain_text: 'Test paragraph' }],
      },
    };

    const { getByText } = render(<Paragraph block={block} />);
    expect(getByText('Test paragraph')).toBeInTheDocument();
  });
});
