import { Request, Response } from "express-serve-static-core";
import { CreateUserDto } from "../dtos/CreateUser.dto";
import User from "../models/user";
import { generateToken } from "../lib/token";

interface AuthenticatedRequest extends Request {
  user_id?: string;
}
interface UserCategoriesRequest extends AuthenticatedRequest {
  body: {
    expenses: string[];
    income: string[];
    savings: string[];
  };
}
interface UserResponse {
  email: string;
  firstName: string;
  lastName: string;
  categories: {
    expenses: string[];
    income: string[];
    savings: string[];
  };
}

export default class UserController {
  public static async updateCategories(
    req: UserCategoriesRequest,
    res: Response<{ token?: String; message: String }>
  ) {
    const categories = req.body;

    const user = await User.findById(req.user_id);
    if (user) {
      user.categories = categories;
      await user.save();
    }

    if (req.user_id) {
      const newToken = generateToken(req.user_id);
      res.status(200).json({ message: "categories updated", token: newToken });
    }
  }
  public static async getNonSensitiveData(
    req: AuthenticatedRequest,
    res: Response<{ user: UserResponse; token: string }>
  ) {
    const user = await User.findById(
      req.user_id,
      "email firstName lastName categories"
    );
    console.log(user)

    if (user && req.user_id) {
      const newToken = generateToken(req.user_id);
      res.status(200).json({ user: user, token: newToken });
    }
  }
}
