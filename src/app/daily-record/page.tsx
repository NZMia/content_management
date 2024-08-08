'use client'; // Required for client-side hooks

import { useEffect, useState } from 'react';

interface NotionPageData {
  properties: {
    [key: string]: unknown; // Generic type for properties
  };
  // Add other relevant types based on your Notion data structure
}

const DailyRecordPage: React.FC = () => {
  const [pageData, setPageData] = useState<NotionPageData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPageData() {
      try {
        const response = await fetch('/api/daily-records');
        if (!response.ok) {
          throw new Error('Failed to fetch page data');
        }
        const data = await response.json();
        setPageData(data);
      } catch (error) {
        console.error('Error fetching page data:', error);
        setError('Failed to fetch page data');
      }
    }

    fetchPageData();
  }, []);

  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Notion Page Data</h1>
      {pageData ? (
        <pre>{JSON.stringify(pageData, null, 2)}</pre>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default DailyRecordPage;
