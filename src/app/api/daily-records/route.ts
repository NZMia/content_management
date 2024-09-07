import { Client } from '@notionhq/client';
import { NextResponse, NextRequest } from 'next/server';

export interface ITODO {
  id: string;
  status: string;
  title: string;
}

const notion = new Client({ auth: process.env.NOTION_SECRET });
const databaseId = process.env.TODO_DATABASE_ID as string;

// Helper function to handle errors
const handleError = (error: unknown, message: string) => {
  console.error(message, error);
  return NextResponse.json({ error: message }, { status: 500 });
};

// Helper function to extract todo data
const extractTodoData = (result: any): ITODO => ({
  id: result.id,
  status: result.properties.Status.status.name,
  title: result.properties.Name.title[0]?.plain_text || '',
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const pageSize = parseInt(searchParams.get('pageSize') || '10', 10);
    const completed = searchParams.get('completed') === 'true';

    const filter = completed
      ? { property: 'Status', status: { equals: 'Done' } }
      : {
          or: [
            { property: 'Status', status: { equals: 'Not started' } },
            { property: 'Status', status: { equals: 'In progress' } },
          ],
        };

    const todoBlock = await notion.databases.query({
      database_id: databaseId,
      page_size: pageSize,
      start_cursor: page > 1 ? ((page - 1) * pageSize).toString() : undefined,
      filter,
    });

    const todos: ITODO[] = todoBlock.results.map(extractTodoData);
    const hasMore = todoBlock.has_more;

    return NextResponse.json({ todos, hasMore }, { status: 200 });
  } catch (error) {
    return handleError(error, 'Failed to fetch data from Notion');
  }
}

export async function POST(req: NextRequest) {
  try {
    const { title, status } = await req.json();

    if (!title || !status) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const newTodo = await notion.pages.create({
      parent: { database_id: databaseId },
      properties: {
        Name: { title: [{ type: 'text', text: { content: title } }] },
        Status: { status: { name: status } },
      },
    });

    return NextResponse.json(
      { message: 'Todo created successfully', newTodo },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, 'Failed to add data to Notion');
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

    const properties: any = {};
    if (title)
      properties.Name = { title: [{ type: 'text', text: { content: title } }] };
    if (status) properties.Status = { status: { name: status } };

    const response = await notion.pages.update({ page_id: id, properties });
    return NextResponse.json(
      { message: 'Todo updated successfully', response },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, 'Failed to update data in Notion');
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

    await notion.pages.update({ page_id: id, archived: true });
    return NextResponse.json(
      { message: 'Todo deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting todo:', error);
    return handleError(error, 'Failed to delete data from Notion');
  }
}
