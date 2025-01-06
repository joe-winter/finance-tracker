import { Schema, model } from "mongoose";

interface User {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  categories: {
    expenses: string[];
    income: string[];
    savings: string[];
  };
}

const UserSchema = new Schema<User>({
  email: { type: String },
  password: { type: String },
  firstName: { type: String },
  lastName: { type: String },
  categories: {
    type: {
      expenses: { type: [String], default: [] },
      income: { type: [String], default: [] },
      savings: { type: [String], default: [] },
    },
  },
});

const User = model("User", UserSchema);

export default User;
