import { Client } from '@notionhq/client';
import { NextResponse } from 'next/server';

// Initialize the Notion client with your integration token
const notion = new Client({ auth: process.env.NOTION_SECRET });

export async function GET() {
  try {
    // Fetch children of the specified block/page in Notion
    const response = await notion.blocks.children.list({
      block_id: process.env.PAGE_ID as string,
    });

    // Return the raw response for inspection
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Error fetching data from Notion:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data from Notion' },
      { status: 500 }
    );
  }
}
