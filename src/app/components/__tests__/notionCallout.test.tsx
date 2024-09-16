import React from 'react';

import { render } from '@testing-library/react';

import Callout from '../notion-blocks/Callout';

describe('notionCallout', () => {
  it('renders callout correctly', () => {
    const block = {
      callout: {
        rich_text: [{ plain_text: 'Test callout' }],
        icon: { emoji: '📌' },
      },
    };

    const { getByText } = render(<Callout block={block} />);
    expect(getByText('📌')).toBeInTheDocument();
    expect(getByText('Test callout')).toBeInTheDocument();
  });
});
