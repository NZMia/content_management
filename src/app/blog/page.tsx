'use client';

import React, { useState, useEffect } from 'react';

import Image from 'next/image';
import Link from 'next/link'; // Add this import

interface BlogPost {
  id: string;
  properties: string;
  tags: string[];
  published: boolean;
  createdBy: string;
  createdAt: string;
  coverImage: string | null;
}

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/blog');
        if (!response.ok) {
          throw new Error('Failed to fetch blog posts');
        }
        const data = await response.json();
        setPosts(data);
      } catch (err) {
        setError('Error fetching blog posts');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold text-gray-800 dark:text-white">
        Blog
      </h1>
      <p className="mb-8 text-lg text-gray-600 dark:text-gray-300">
        Explore my thoughts and insights on various topics.
      </p>
      <div className="grid gap-6 md:grid-cols-2">
        {posts.map((post) => (
          <div
            key={post.id}
            className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800"
          >
            {post.coverImage && (
              <div className="relative mb-4 h-48 w-full">
                <Image
                  src={post.coverImage}
                  alt={post.properties}
                  fill
                  className="rounded-lg object-cover"
                  loading="lazy"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            )}
            <h2 className="mb-2 text-xl font-semibold text-gray-800 dark:text-white">
              {post.properties}
            </h2>
            <p className="mb-2 text-sm text-gray-600 dark:text-gray-300">
              By {post.createdBy} on{' '}
              {new Date(post.createdAt).toLocaleDateString()}
            </p>
            <div className="mb-4">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="mr-2 rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-800"
                >
                  {tag}
                </span>
              ))}
            </div>
            <Link
              href={`/blog/${post.id}`}
              className="text-blue-600 hover:underline dark:text-blue-400"
            >
              Read more
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
