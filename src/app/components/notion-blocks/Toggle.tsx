'use client';
import { useState } from 'react';

import BulletedListItem from './BulletedListItem';
import Callout from './Callout';
import Code from './Code';
import Heading from './Heading';
import Paragraph from './Paragraph';
import Quote from './Quote';

function renderBlocks(blocks: any[] | undefined) {
  if (!blocks || blocks.length === 0) {
    return null;
  }

  return blocks.map((block, index) => {
    switch (block.type) {
      case 'paragraph':
        return <Paragraph key={index} block={block} />;
      case 'heading_1':
      case 'heading_2':
      case 'heading_3':
        return <Heading key={index} block={block} />;
      case 'code':
        return <Code key={index} block={block} />;
      case 'quote':
        return <Quote key={index} block={block} />;
      case 'callout':
        return <Callout key={index} block={block} />;
      case 'bulleted_list_item':
        return <BulletedListItem key={index} block={block} />;
      default:
        console.log('Unhandled block type:', block.type);
        return null;
    }
  });
}

export default function Toggle({ block }: { block: any }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <details className="mb-4" open={isOpen}>
      <summary
        className="cursor-pointer font-semibold"
        onClick={(e) => {
          e.preventDefault();
          setIsOpen(!isOpen);
        }}
      >
        {block.toggle.rich_text.map((text: any, index: number) => (
          <span key={index}>{text.plain_text}</span>
        ))}
      </summary>
      {isOpen && (
        <div className="mt-2 pl-4">{renderBlocks(block.toggle.children)}</div>
      )}
    </details>
  );
}
