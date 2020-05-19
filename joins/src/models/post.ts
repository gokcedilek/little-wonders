import mongoose from 'mongoose';
import { Join, JoinStatus } from './join';

interface PostAttrs {
  title: string;
  price: number;
  numPeople: number;
}

export interface PostDoc extends mongoose.Document {
  title: string;
  price: number;
  numPeople: number;
  isFull(): Promise<boolean>;
}

interface PostModel extends mongoose.Model<PostDoc> {
  build(attrs: PostAttrs): PostDoc;
}

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    numPeople: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        //ret is the object that is just about to be turned into JSON
        ret.id = ret._id; //standardize _id to id
        delete ret._id;
      },
    },
  }
);

//statics: adds a function to the post model
postSchema.statics.build = (attrs: PostAttrs): PostDoc => {
  return new Post(attrs);
};

//methods: adds a function to the post doc
postSchema.methods.isFull = async function () {
  //this === post doc we called isFull on
  const existingJoins = await Join.find({
    post: this,
    status: {
      $in: [
        JoinStatus.Created,
        JoinStatus.AwaitingPayment,
        JoinStatus.Complete,
      ],
    },
  });
  //console.log(existingJoins);
  return existingJoins.length >= this.numPeople;
};

const Post = mongoose.model<PostDoc, PostModel>('Post', postSchema);

export { Post };
