import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { Join, JoinStatus } from './join';

//posts inside the join db need to include the version property! we need to CHECK the version # whenever we process a join event, to prevent processing events out of order!

interface PostAttrs {
  id: string; //because "post" is actually defined in another service, we want to override the default "id" provided for post documents in the *joins* service, with the actual id of the post defined in the *posts* service
  title: string;
  description: string;
  userId: string;
  numPeople: number;
  location: string;
  time: string;
}

export interface PostDoc extends mongoose.Document {
  title: string;
  description: string;
  userId: string;
  numPeople: number;
  location: string;
  time: string;
  isFull(): Promise<boolean>;
  version: number; //our custom __v (versioning property), renamed
}

interface PostModel extends mongoose.Model<PostDoc> {
  build(attrs: PostAttrs): PostDoc;
  //either find a postDoc from the query, or null
  findLastPost(event: { id: string; version: number }): Promise<PostDoc | null>;
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
    userId: {
      type: String,
      required: true,
    },
    numPeople: {
      type: Number,
      required: true,
      min: 1,
    },
    location: {
      type: String,
      required: true,
    },
    time: {
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
    description: attrs.description,
    userId: attrs.userId,
    numPeople: attrs.numPeople,
    location: attrs.location,
    time: attrs.time,
  });
};

//do a query for id + version of the post (abstract our custom query as a helper method)
postSchema.statics.findLastPost = (event: { id: string; version: number }) => {
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
      $in: [JoinStatus.Created],
    },
  });
  return existingJoins.length >= this.numPeople;
};

const Post = mongoose.model<PostDoc, PostModel>('Post', postSchema);

export { Post };
