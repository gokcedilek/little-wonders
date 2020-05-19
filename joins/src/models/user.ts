import mongoose from 'mongoose';

interface UserAttrs {
  email: string;
}

export interface UserDoc extends mongoose.Document {
  email: string;
}

interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
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

userSchema.statics.build = (attrs: UserAttrs): UserDoc => {
  return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };
