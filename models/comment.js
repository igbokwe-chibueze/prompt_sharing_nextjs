
import { Schema, model, models } from 'mongoose';

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
    }
});

const Comment = models.Comment || model("Comment", CommentSchema);

export default Comment;
