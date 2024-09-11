// // pages/api/bookmark/[id].js

import Prompt from '@/models/prompt';
import Comment from '@/models/comment';
import { NextResponse } from 'next/server';
import { connectToDB } from '@utils/database';

export async function POST(req, { params }) {
  await connectToDB();

  const { id } = params;
  const { entityType, userId, action } = await req.json();

  let Model;
  switch (entityType) {
    case 'prompt':
      Model = Prompt;
      break;
    case 'comment':
      Model = Comment;
      break;
    default:
      return NextResponse.json({ message: 'Invalid entity type' }, { status: 400 });
  }

  try {
    const entity = await Model.findById(id);
    if (!entity) {
      return NextResponse.json({ message: 'Entity not found' }, { status: 404 });
    }

    const bookmarkIndex = entity.bookmarks.indexOf(userId);
    let isBookmarked = bookmarkIndex !== -1;

    if (action === 'toggle') {
      if (isBookmarked) {
        entity.bookmarks.splice(bookmarkIndex, 1);
      } else {
        entity.bookmarks.push(userId);
      }
      await entity.save();
      isBookmarked = !isBookmarked;
    }

    return NextResponse.json({
      isBookmarked,
      bookmarkCount: entity.bookmarks.length
    }, { status: 200 });

  } catch (error) {
    console.error('Error processing bookmark:', error);
    return NextResponse.json({ message: 'Something went wrong', error: error.message }, { status: 500 });
  }
}