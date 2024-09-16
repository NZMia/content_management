import React from 'react';

import { render } from '@testing-library/react';

import Code from '../notion-blocks/Code';

describe('notionCode', () => {
  it('renders code block correctly', () => {
    const block = {
      code: {
        language: 'javascript',
        rich_text: [{ plain_text: 'const test = "Hello, World!";' }],
      },
    };

    const { getByText } = render(<Code block={block} />);
    const code = getByText('const test = "Hello, World!";');
    expect(code).toBeInTheDocument();
    expect(code.parentElement).toHaveClass('language-javascript');
  });
});
