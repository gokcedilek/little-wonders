import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { Join, JoinStatus } from './join';

//posts inside the join db need to include the version property! we need to CHECK the version # whenever we process a join event, to prevent processing events out of order!

interface PostAttrs {
  id: string;
  title: string;
  price: number;
  numPeople: number;
}

export interface PostDoc extends mongoose.Document {
  title: string;
  price: number;
  numPeople: number;
  isFull(): Promise<boolean>;
  version: number; //our custom __v (versioning property), renamed
}

interface PostModel extends mongoose.Model<PostDoc> {
  build(attrs: PostAttrs): PostDoc;
  //either find a postDoc from the query, or null
  //rename to findLastPost
  findLastEvent(event: {
    id: string;
    version: number;
  }): Promise<PostDoc | null>;
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

//track the version of these records using a field "version", rather than the default "__v"
postSchema.set('versionKey', 'version');
//enable OCC plugin!!!!!!!
postSchema.plugin(updateIfCurrentPlugin);

//statics: adds a function to the post model
postSchema.statics.build = (attrs: PostAttrs): PostDoc => {
  //return new Post(attrs);
  return new Post({
    _id: attrs.id, //rename the id to _id so that mongo won't assign a random id to this record, and will instead use attrs.id (to be consistent with our posts service)
    title: attrs.title,
    price: attrs.price,
    numPeople: attrs.numPeople,
  });
};

//do a query for id + version of the post (abstract our custom query as a helper method)
postSchema.statics.findLastEvent = (event: { id: string; version: number }) => {
  return Post.findOne({
    _id: event.id,
    version: event.version - 1,
  });
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
