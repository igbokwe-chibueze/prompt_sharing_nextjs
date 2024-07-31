import { Schema, model, models } from 'mongoose';

const PromptSchema = new Schema({
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    //required: true,
  },
  prompt: {
    type: String,
    required: [true, 'Prompt is required.'],
  },
  tag: {
    type: String,
    required: [true, 'Tag is required.'],
  }
}, { timestamps: true });

const Prompt = models.Prompt || model('Prompt', PromptSchema); // checks the models to see if the prompt exists, only create a new model if it doesn't.

export default Prompt;