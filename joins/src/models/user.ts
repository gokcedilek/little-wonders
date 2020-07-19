import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { Join } from './join';

interface UserAttrs {
  id: string;
  email: string;
}

export interface UserDoc extends mongoose.Document {
  id: string;
  email: string;
  version: number;
}

interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
  findLastUser(event: { id: string; version: number }): Promise<UserDoc | null>;
}

const userSchema = new mongoose.Schema(
  {
    email: {
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
userSchema.set('versionKey', 'version');
//enable OCC plugin!!!!!!!
userSchema.plugin(updateIfCurrentPlugin);

userSchema.statics.build = (attrs: UserAttrs): UserDoc => {
  //return new User(attrs);
  return new User({
    _id: attrs.id, //rename the id to _id so that mongo won't assign a random id to this record, and will instead use attrs.id (to be consistent with our users service) -- this is where the magic of "foreign key" happens in mongoose!!
    email: attrs.email,
  });
};

//do a query for id + version of the post (abstract our custom query as a helper method)
userSchema.statics.findLastUser = (event: { id: string; version: number }) => {
  return User.findOne({
    _id: event.id,
    version: event.version - 1,
  });
};

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };
