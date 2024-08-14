import { Schema, model, models } from 'mongoose';
import RatingSchema from './rating';
import RepostSchema from './repost';

const PromptSchema = new Schema({
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  prompt: {
    type: String,
    required: [true, 'Prompt is required.'],
  },
  tags: {
    type: [String],
    required: [true, 'At least one tag is required.'],
  },
  likes: {
    type: [Schema.Types.ObjectId],
    ref: 'User',
    default: [],
  },
  bookmarks: {
    type: [Schema.Types.ObjectId],
    ref: 'User',
    default: [],
  },
  ratings: [RatingSchema],
  averageRating: {
    type: Number,
    default: 0, // Default value for averageRating
  },
  reposts: [RepostSchema],
  createdAt: {
    type: Date,
    default: null,
  },
  updatedAt: {
    type: Date,
    default: null,
  },
});

const Prompt = models.Prompt || model('Prompt', PromptSchema);

export default Prompt;
