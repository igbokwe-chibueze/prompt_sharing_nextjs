// models/bookmark.js
import { Schema, model, models } from 'mongoose';

// Define the BookmarkSchema
const BookmarkSchema = new Schema({
  user: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 

  },
  prompt: { 
    type: Schema.Types.ObjectId, 
    ref: 'Prompt', 
    required: true },
}, { timestamps: true });

// Create or get the Bookmark model
const Bookmark = models.Bookmark || model('Bookmark', BookmarkSchema);

export default Bookmark;
