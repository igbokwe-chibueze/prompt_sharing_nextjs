// // pages/api/bookmark/[id].js

// import Prompt from '@/models/prompt';
// import Comment from '@/models/comment';
// import { NextResponse } from 'next/server';
// import { connectToDB } from '@utils/database';

// export async function POST(req, { params }) {
//   await connectToDB();

//   const { id } = params;
//   const { entityType, userId, action } = await req.json();

//   let Model;
//   switch (entityType) {
//     case 'prompt':
//       Model = Prompt;
//       break;
//     case 'comment':
//       Model = Comment;
//       break;
//     default:
//       return NextResponse.json({ message: 'Invalid entity type' }, { status: 400 });
//   }

//   try {
//     const entity = await Model.findById(id);
//     if (!entity) {
//       return NextResponse.json({ message: 'Entity not found' }, { status: 404 });
//     }

//     const bookmarkIndex = entity.bookmarks.indexOf(userId);
//     let isBookmarked = bookmarkIndex !== -1;

//     if (action === 'toggle') {
//       if (isBookmarked) {
//         entity.bookmarks.splice(bookmarkIndex, 1);
//       } else {
//         entity.bookmarks.push(userId);
//       }
//       await entity.save();
//       isBookmarked = !isBookmarked;
//     }

//     return NextResponse.json({
//       isBookmarked,
//       bookmarkCount: entity.bookmarks.length
//     }, { status: 200 });

//   } catch (error) {
//     console.error('Error processing bookmark:', error);
//     return NextResponse.json({ message: 'Something went wrong', error: error.message }, { status: 500 });
//   }
// }

// pages/api/bookmark/[entityType]/[id].js
import { connectToDB } from "@utils/database";
import Comment from "@models/comment";
import Prompt from "@models/prompt";

const modelMap = {
  comment: Comment,
  prompt: Prompt
};

export const POST = async (request, { params }) => {
    const { userId, entityType } = await request.json();
    const { id } = params;

    try {
        await connectToDB();

        const Model = modelMap[entityType];

        if (!Model) {
            return new Response("Invalid entity type", { status: 400 });
        }

        const entity = await Model.findById(id);

        if (!entity) {
            return new Response("Entity not found", { status: 404 });
        }

        const userBookmarkedIndex = entity.bookmarks.indexOf(userId);

        if (userBookmarkedIndex === -1) {
            // User hasn't bookmarked the entity, so add the bookmark
            entity.bookmarks.push(userId);
        } else {
            // User has already bookmarked the entity, so remove the bookmark
            entity.bookmarks.splice(userBookmarkedIndex, 1);
        }

        await entity.save();

        return new Response(JSON.stringify({ bookmarks: entity.bookmarks.length, isBookmarked: userBookmarkedIndex === -1 }), { status: 200 });
    } catch (error) {
        console.error('Error handling bookmark:', error);
        return new Response("Error updating entity bookmarks", { status: 500 });
    }
}
