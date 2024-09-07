import React from 'react';

export default function Blog() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold text-gray-800 dark:text-white">
        Blog
      </h1>
      <p className="mb-8 text-lg text-gray-600 dark:text-gray-300">
        Explore my thoughts and insights on various topics.
      </p>
      <div className="grid gap-6 md:grid-cols-2">
        {/* Example blog post previews */}
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800"
          >
            <h2 className="mb-2 text-xl font-semibold text-gray-800 dark:text-white">
              Blog Post {item}
            </h2>
            <p className="mb-4 text-gray-600 dark:text-gray-300">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
            <a
              href="#"
              className="text-blue-600 hover:underline dark:text-blue-400"
            >
              Read more
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
