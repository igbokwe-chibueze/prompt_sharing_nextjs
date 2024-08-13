// models/repost.js

import { Schema } from 'mongoose';

const RepostSchema = new Schema({
    repostedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    repostedAt: {
      type: Date,
      default: Date.now,
    },
  }, { _id: false });

export default RepostSchema;