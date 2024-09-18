import { Client } from '@notionhq/client';
import {
  PageObjectResponse,
  PartialPageObjectResponse,
  PartialDatabaseObjectResponse,
  DatabaseObjectResponse,
} from '@notionhq/client/build/src/api-endpoints';
import { NextResponse } from 'next/server';

export interface BlogPost {
  id: string;
  properties: string;
  tags: string[];
  published: boolean;
  createdBy: string;
  createdAt: string;
  coverImage: string | null;
  content: any[]; // Change this from string to any[]
}

const notion = new Client({ auth: process.env.NOTION_SECRET });

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (id) {
    return GET_BY_ID(id);
  }

  try {
    const response = await notion.databases.query({
      database_id: process.env.BLOG_DATABASE_ID as string,
      filter: {
        property: 'Published',
        checkbox: {
          equals: true,
        },
      },
    });

    const posts: BlogPost[] = await Promise.all(
      response.results.map(
        async (
          page:
            | PageObjectResponse
            | PartialPageObjectResponse
            | PartialDatabaseObjectResponse
            | DatabaseObjectResponse
        ) => {
          if (!('properties' in page)) {
            throw new Error('Invalid page object');
          }

          let coverImage = null;
          if ('cover' in page && page.cover) {
            if (page.cover.type === 'external') {
              coverImage = page.cover.external.url;
            } else if (page.cover.type === 'file') {
              coverImage = page.cover.file.url;
            }
          }

          const properties = page.properties as Record<string, any>;

          return {
            id: page.id,
            properties: properties['Name']?.title[0]?.plain_text || '',
            tags:
              properties['Tags']?.multi_select?.map((tag: any) => tag.name) ||
              [],
            published: properties['Published']?.checkbox || false,
            createdBy: properties['CreatedBy']?.created_by?.name || '',
            createdAt: properties['CreatedAt']?.created_time || '',
            coverImage: coverImage,
            content: [], // Add this line to match the BlogPost interface
          };
        }
      )
    );

    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json(
      { error: 'Error fetching blog posts' },
      { status: 500 }
    );
  }
}

async function GET_BY_ID(id: string) {
  try {
    const response = await notion.pages.retrieve({ page_id: id });
    const blocks = await notion.blocks.children.list({ block_id: id });

    if (!('properties' in response)) {
      throw new Error('Invalid page object');
    }

    let coverImage = null;
    if ('cover' in response && response.cover) {
      if (response.cover.type === 'external') {
        coverImage = response.cover.external.url;
      } else if (response.cover.type === 'file') {
        coverImage = response.cover.file.url;
      }
    }

    const properties = response.properties as Record<string, any>;

    const content = blocks.results.map((block: any) => {
      return block;
    });

    const post: BlogPost = {
      id: response.id,
      properties: properties['Name']?.title[0]?.plain_text || '',
      tags: properties['Tags']?.multi_select?.map((tag: any) => tag.name) || [],
      published: properties['Published']?.checkbox || false,
      createdBy: properties['CreatedBy']?.created_by?.name || '',
      createdAt: properties['CreatedAt']?.created_time || '',
      coverImage: coverImage,
      content: content,
    };
    return NextResponse.json(post);
  } catch (error) {
    console.error('Error fetching blog post by id:', error);
    return NextResponse.json(
      { error: 'Error fetching blog post by id' },
      { status: 500 }
    );
  }
}
