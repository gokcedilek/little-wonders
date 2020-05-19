import mongoose from 'mongoose';
import { JoinStatus } from '@gdsocialevents/common/';
import { PostDoc } from './post';
import { UserDoc } from './user';

export { JoinStatus };

interface JoinAttrs {
  user: UserDoc;
  status: JoinStatus;
  expAt: Date;
  post: PostDoc;
}

interface JoinDoc extends mongoose.Document {
  user: UserDoc;
  status: JoinStatus;
  expAt: Date;
  post: PostDoc;
}

interface JoinModel extends mongoose.Model<JoinDoc> {
  build(attrs: JoinAttrs): JoinDoc;
}

const joinSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(JoinStatus), //set, update etc: mongoose will make sure we set the value to one of the values in JoinStatus
      default: JoinStatus.Created,
    },
    expAt: {
      type: mongoose.Schema.Types.Date,
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id; //standardize _id to id
        delete ret._id;
      },
    },
  }
);

joinSchema.statics.build = (attrs: JoinAttrs): JoinDoc => {
  return new Join(attrs);
};

const Join = mongoose.model<JoinDoc, JoinModel>('Join', joinSchema);

export { Join };
