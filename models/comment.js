
import { Schema, model, models } from 'mongoose';
import RepostSchema from './repost';

const CommentSchema = new Schema({
    postId: { 
        type: Schema.Types.ObjectId,
        ref: 'Post', 
        required: true 
    },
    userId: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    content: { 
        type: String, 
        required: true 
    },
    parentCommentId: { 
        type: Schema.Types.ObjectId, 
        ref: 'Comment', 
        default: null 
    }, // null if it's a root comment
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    reposts: [RepostSchema],
    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    bookmarks: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    profileClickCount: {
        type: Number,
        default: 0,
    },
    entityClickCount: {
        type: Number,
        default: 0,
    },
    deletedAt: {
        type: Date,
        default: null, // null means the comment is not deleted
    },
});

const Comment = models.Comment || model("Comment", CommentSchema);

export default Comment;
