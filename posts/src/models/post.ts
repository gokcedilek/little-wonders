import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface PostAttrs {
  title: string;
  description: string;
  userId: string;
  numPeople: number;
  location: string;
  time: string;
}

//mongoose.Document has a property "__v", we need to add "version" to the post document
interface PostDoc extends mongoose.Document {
  title: string;
  description: string;
  userId: string;
  numPeople: number;
  location: string;
  time: string;
  version: number; //our custom field used for versioning, OCC
  joinIds: [string]; //only this field of post will not be shared with the "joins" service, because the "joins" service already knows about this info!
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
    joinIds: {
      type: [String],
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

postSchema.statics.build = (attrs: PostAttrs): PostDoc => {
  return new Post(attrs);
};

//whenever we update a document, we need to increment its version! the way to do this is, call save()! because the updateIfCurrent package already updates the version when we call save, so just the functionality of that package!
//cannot use an arrow function, because it would've messed up with the value of "this"!
// postSchema.pre('updateOne', async function (done) {
//   const post = await Post.findById(this.getQuery()._id); //updateOne is queried by id, so we have access to it!
//   await post!.save(); //we know it's not null, because we checked if the post exists before attempting to update it!
//   done();
// });

// postSchema.post('save', async function (doc) {
//   // const post = await Post.findById(this.getQuery()._id); //updateOne is queried by id, so we have access to it!
//   // await post!.save(); //we know it's not null, because we checked if the post exists before attempting to update it!
//   console.log(doc._id);
//   //done();
// });

// postSchema.post('save', async function (doc) {
//   console.log(doc);
//   console.log(doc._id);
// });

// postSchema.post('updateOne', async function (doc) {
//   console.log(doc);
//   console.log(doc._id);
// });

const Post = mongoose.model<PostDoc, PostModel>('Post', postSchema);

export { Post };
