// src/app/api/daily_record.ts
import { Client } from '@notionhq/client';
import { NextResponse } from 'next/server';

// Initialize the Notion client with your integration token
const notion = new Client({ auth: process.env.NOTION_SECRET });
// Fetch daily records directly using the fixed PAGE_ID from environment variables
export async function getDailyRecord() {
  try {
    const data = await notion.blocks.children.list({
      block_id: process.env.PAGE_ID as string,
    });

    // Return the raw data for inspection
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Error fetching daily records:', error);
    return NextResponse.json(
      { error: 'Failed to fetch daily records' },
      { status: 500 }
    );
  }
}
