import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  email: {type: String},
  password: {type: String},
  firstName: {type: String},
  lastName: {type: String},
})

const User = mongoose.model("User", UserSchema)

export default User