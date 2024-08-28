import { Client } from '@notionhq/client';
import { QueryDatabaseResponse } from '@notionhq/client/build/src/api-endpoints';
import { NextResponse, NextRequest } from 'next/server';

export interface ITODO {
  id: string;
  status: string;
  title: string;
}
// Initialize the Notion client with your integration token
const notion = new Client({ auth: process.env.NOTION_SECRET });
const databaseId = process.env.TODO_DATABASE_ID as string;

// Fetch the todo list from Notion
export async function GET() {
  try {
    // Fetch children of the specified block/page in Notion
    const todoBlock: QueryDatabaseResponse = await notion.databases.query({
      database_id: databaseId,
    });
    // Extract the relevant fields: status and plain_text title
    const extractedData: ITODO[] = todoBlock.results.map((result: any) => ({
      id: result.id as string,
      status: result.properties.Status.status.name as string,
      title: result.properties.Name.title[0]?.plain_text || ('' as string),
    }));

    console.log('extractedData:', JSON.stringify(extractedData, null, 2));
    // Return the raw response for inspection
    return NextResponse.json(extractedData, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch data from Notion' },
      { status: 500 }
    );
  }
}

// Add a new todo to the Notion database
export async function POST(req: NextRequest) {
  try {
    const { title, status } = await req.json();

    if (!title || !status) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create a new page in the Notion database
    const newTodo = await notion.pages.create({
      parent: { database_id: databaseId },
      properties: {
        Name: {
          title: [
            {
              type: 'text',
              text: {
                content: title,
              },
            },
          ],
        },
        Status: {
          status: {
            name: status,
          },
        },
      },
    });

    return NextResponse.json(
      { message: 'Todo created successfully', newTodo },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to add data to Notion' },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const { id, title, status } = await req.json();

    if (!id || (!title && !status)) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Update the page properties in Notion
    const response = await notion.pages.update({
      page_id: id,
      properties: {
        ...(title && {
          Name: {
            title: [
              {
                type: 'text',
                text: {
                  content: title,
                },
              },
            ],
          },
        }),
        ...(status && {
          Status: {
            status: {
              name: status,
            },
          },
        }),
      },
    });

    return NextResponse.json(
      { message: 'Todo updated successfully', response },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update data in Notion' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Missing required field: id' },
        { status: 400 }
      );
    }

    // Archive the page in Notion (equivalent to deletion)
    await notion.pages.update({
      page_id: id,
      archived: true,
    });

    return NextResponse.json(
      { message: 'Todo deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete data from Notion' },
      { status: 500 }
    );
  }
}
