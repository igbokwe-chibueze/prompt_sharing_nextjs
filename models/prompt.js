import { Schema, model, models } from 'mongoose';

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
}, { timestamps: true });

const Prompt = models.Prompt || model('Prompt', PromptSchema);

export default Prompt;
