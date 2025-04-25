import { Schema, model } from "mongoose";

const userSchema = new Schema({
  name: {
    type: String,
    trim: true,
    require: [true, "User name is require"],
    minLength: 2,
    maxLength: 50,
  },
  email: {
    type: String,
    trim: true,
    require: [true, "User's email is require"],
    unique: true,
    lowercase: true,
    match: [/\S+@\S+\.\S+/, "Please fill a valid email address"],
  },
  password: {
    type: String,
    require: [true, "User's password is require"],
    minLength:6
  },
}, {timestamps: true});


const User = model("User", userSchema);

export default User;