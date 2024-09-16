'use client';

import React, { useState, useEffect } from 'react';

import Image from 'next/image';
// import Image from '../../components/notion-blocks/Image';
import { useParams } from 'next/navigation';

import { BlogPost } from '../../api/blog/route';
import BulletedListItem from '../../components/notion-blocks/BulletedListItem';
import Callout from '../../components/notion-blocks/Callout';
import Code from '../../components/notion-blocks/Code';
import Heading from '../../components/notion-blocks/Heading';
import Paragraph from '../../components/notion-blocks/Paragraph';
import Quote from '../../components/notion-blocks/Quote';
import Toggle from '../../components/notion-blocks/Toggle';

// Import other custom components for different block types

export default function BlogPostPage() {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/blog?id=${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch blog post');
        }
        const data = await response.json();
        JSON.stringify(post, null, 2);
        setPost(data);
      } catch (err) {
        setError('Error fetching blog post');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [id, post]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error || !post) {
    return <div>Error: {error || 'Post not found'}</div>;
  }

  const renderBlock = (block: any) => {
    switch (block.type) {
      case 'paragraph':
        return <Paragraph block={block} />;
      case 'heading_1':
      case 'heading_2':
      case 'heading_3':
        return <Heading block={block} />;
      case 'code':
        return <Code block={block} />;
      case 'quote':
        return <Quote block={block} />;
      case 'callout':
        return <Callout block={block} />;
      case 'toggle':
        return <Toggle block={block} />;
      case 'bulleted_list_item':
        return <BulletedListItem block={block} />;
      default:
        console.log('Unhandled block type:', block.type);
        return null;
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold text-gray-800 dark:text-white">
        {post.properties}
      </h1>
      {post.coverImage && (
        <div className="relative mb-6 h-64 w-full">
          <Image
            src={post.coverImage}
            alt={post.properties}
            fill
            className="rounded-lg object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}
      <div className="mb-4">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          By {post.createdBy} on {new Date(post.createdAt).toLocaleDateString()}
        </p>
        <div className="mt-2">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="mr-2 rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-800"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div className="prose dark:prose-invert">
        {post.content.map((block: any) => renderBlock(block))}
      </div>
    </div>
  );
}
