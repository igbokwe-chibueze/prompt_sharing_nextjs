import dbConnect from '@/lib/mongodb';
import Post from '@/models/Post';
import { getSession } from 'next-auth/react';

export default async function handler(req, res) {
  const { method } = req;
  const { id } = req.query;

  await dbConnect();

  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  const userId = session.user.id;

  try {
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    switch (method) {
      case 'PATCH':
        if (post.likes.includes(userId)) {
          // Unlike post
          post.likes = post.likes.filter((likeId) => likeId.toString() !== userId);
        } else {
          // Like post
          post.likes.push(userId);
        }

        await post.save();
        return res.status(200).json({ likes: post.likes.length });
      default:
        res.setHeader('Allow', ['PATCH']);
        return res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
}
