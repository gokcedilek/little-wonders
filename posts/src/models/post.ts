import mongoose from 'mongoose';

interface PostAttrs {
  title: string;
  description: string;
  price: number;
  userId: string;
}

interface PostDoc extends mongoose.Document {
  title: string;
  description: string;
  price: number;
  userId: string;
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
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    userId: {
      type: String,
      required: true,
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

postSchema.statics.build = (attrs: PostAttrs): PostDoc => {
  return new Post(attrs);
};

const Post = mongoose.model<PostDoc, PostModel>('Post', postSchema);

export { Post };
