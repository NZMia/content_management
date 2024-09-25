'use client';

import React from 'react';

export default function Contact() {
  return (
    <div className="mx-auto mt-10 max-w-2xl rounded-lg bg-white p-8 shadow-xl dark:bg-black">
      <h2 className="mb-6 text-center text-3xl font-bold text-black dark:text-white">
        Contact Us
      </h2>
      <div className="space-y-6">
        <div className="border-b border-gray-200 pb-4 dark:border-gray-700">
          <h3 className="text-xl font-semibold text-black dark:text-white">
            Content Publisher Team
          </h3>
          <p className="text-gray-600 dark:text-gray-400">Customer Support</p>
        </div>
        <div className="flex items-center space-x-4">
          <svg
            className="h-6 w-6 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            ></path>
          </svg>
          <div>
            <h4 className="font-medium text-black dark:text-white">Email:</h4>
            <p className="text-gray-600 dark:text-gray-400">
              support@contentpublisher.com
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <svg
            className="h-6 w-6 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
            ></path>
          </svg>
          <div>
            <h4 className="font-medium text-black dark:text-white">Phone:</h4>
            <p className="text-gray-600 dark:text-gray-400">
              +1 (555) 123-4567
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <svg
            className="h-6 w-6 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            ></path>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            ></path>
          </svg>
          <div>
            <h4 className="font-medium text-black dark:text-white">Address:</h4>
            <p className="text-gray-600 dark:text-gray-400">
              123 Publisher Street
              <br />
              San Francisco, CA 94105
              <br />
              United States
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <svg
            className="h-6 w-6 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <div>
            <h4 className="font-medium text-black dark:text-white">
              Business Hours:
            </h4>
            <p className="text-gray-600 dark:text-gray-400">
              Monday - Friday: 9:00 AM - 5:00 PM (PST)
              <br />
              Saturday - Sunday: Closed
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
