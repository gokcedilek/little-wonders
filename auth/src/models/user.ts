import mongoose from 'mongoose';
import { Password } from '../services/password';

//interface that describes the properties (attributes) required to create a new user(record) - we shouldn't pass incorrect attributes!
interface UserAttrs {
  email: string;
  password: string;
}

//interface that describes the properties a User Model has (to tell ts that there will be a "build" function available on this User model) - what the entire collection of users looks like! this is the key -- the model is for the collection, not each individual user!
//all the different properties that will be assigned to the model itself *****(model: entire collection of data, document: one single record)*****
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc; //makes sure we pass the correct arg.s when creating a user
}

//interface that describes the properties that a User Document has - what properties a single user has!!! (a single user is what is returned from the build function we wrote - result of calling new User()!) - return value of the build function!
//properties that a saved user(record) has
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

//schema: properties that a user has
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String, //specific to mongoose, not ts!
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      //turn the user document into json
      transform(doc, ret) {
        //doc: actual user doc, ret: make direct changes to this object, will be turned into json
        ret.id = ret._id; //standardize _id to id
        delete ret._id;
        delete ret.password; //js keyword - remove a property from an object
        //delete ret.__v; //same thing as versionKey: false
      },
      versionKey: false,
    },
  }
);

//automatically hash a password before saving a user to the db: middleware executed anytime before we save a user document to our db
userSchema.pre('save', async function (done) {
  //inside of "pre", we get access to the document (user instance) we are trying to save in the callback function as "this"!

  //if password is being assigned for the first time, or if it has changed, only then re-hash it!
  if (this.isModified('password')) {
    const hashed = await Password.toHash(this.get('password'));
    this.set('password', hashed);
  }
  done(); //after all the async work
});

//the purpose of this function is to allow ts to do typechecking on the attributes that we input to create a user
userSchema.statics.build = (attrs: UserAttrs): UserDoc => {
  return new User(attrs); //a single user!!! - the inputs to the "build" func are verified by typescript!
};

//< >: generic type args to the model function
const User = mongoose.model<UserDoc, UserModel>('User', userSchema); //returns a UserModel (not a single user)

// const user = User.build({
//   email: 'jrngke',
//   password: 'jgrke',
// });

export { User }; //user model
