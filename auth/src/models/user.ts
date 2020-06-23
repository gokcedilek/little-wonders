import mongoose from 'mongoose';
import { Password } from '../services/password';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

//properties required to create a new user record - TS confirms we use the correct attributes when building a user
interface UserAttrs {
  email: string;
  password: string;
}

//properties a User Document has - a User Document is the result of calling new User()
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
  version: number;
}

//properties assigned to the User Model - the Model describes the entire collection, not an individual record
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

//tell Mongoose about what a User looks like
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      //turn the User doc into JSON
      transform(doc, ret) {
        //doc: doc being converted, ret: modified doc that will be turned into JSON
        ret.id = ret._id; //standardize _id to id
        delete ret._id;
        delete ret.password;
      },
    },
  }
);

//middleware executed anytime before we save a User document to our db
userSchema.pre('save', async function (done) {
  //inside of "pre", we get access to the document (user instance) we are trying to save in the callback function as "this"!

  //if password is being assigned for the first time, or if it has changed, only then re-hash it!
  if (this.isModified('password')) {
    const hashed = await Password.toHash(this.get('password'));
    this.set('password', hashed);
  }
  done(); //after the async work
});

//track the version of these records using a field "version", rather than the default "__v"
userSchema.set('versionKey', 'version');
//enable OCC plugin
userSchema.plugin(updateIfCurrentPlugin);

//allow TS to do typechecking on the attributes that we input to create a user
userSchema.statics.build = (attrs: UserAttrs): UserDoc => {
  return new User(attrs);
};

//< >: generic type args to the model function
const User = mongoose.model<UserDoc, UserModel>('User', userSchema); //returns a UserModel (not a single user)

export { User }; //user model
