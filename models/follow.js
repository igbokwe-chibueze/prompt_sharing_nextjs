// models/Follow.js

import { Schema, model, models } from 'mongoose';

const FollowSchema = new Schema({
  follower: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  following: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now, // Automatically set to the current date/time when a follow relationship is created
  },
});

const Follow = models.Follow || model("Follow", FollowSchema);

export default Follow;