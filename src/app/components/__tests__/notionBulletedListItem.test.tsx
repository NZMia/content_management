import React from 'react';

import { render } from '@testing-library/react';

import BulletedListItem from '../notion-blocks/BulletedListItem';

describe('notionBulletedListItem', () => {
  it('renders bulleted list item correctly', () => {
    const block = {
      bulleted_list_item: {
        rich_text: [{ plain_text: 'Test bullet point' }],
      },
    };

    const { getByText } = render(<BulletedListItem block={block} />);
    const listItem = getByText('Test bullet point');
    expect(listItem).toBeInTheDocument();
    expect(listItem.tagName).toBe('SPAN');
    // expect(listItem).toHaveClass('list-disc');
  });
});
