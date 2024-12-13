import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  email: {type: String},
  password: {type: String},
  firstname: {type: String},
  lastname: {type: String},
})

const User = mongoose.model("User", UserSchema)

export default User