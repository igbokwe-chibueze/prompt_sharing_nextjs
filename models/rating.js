// models/rating.js

import { Schema } from 'mongoose';

const RatingSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
}, { _id: false });

export default RatingSchema;
