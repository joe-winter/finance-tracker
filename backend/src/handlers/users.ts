import { Request, Response } from "express-serve-static-core";
import { CreateUserDto } from "../dtos/CreateUser.dto";
import { UserType } from "../types/response";
import User from "../models/user";
import { generateToken } from "../lib/token";

export default class UsersController {
  public static async createUser(
    req: Request<{}, {}, CreateUserDto>,
    res: Response<{ token?: string; message: string }>
  ) {
    const { email, password, firstName, lastName } = req.body;

    const user = new User({ email, password, firstName, lastName });

    await user.save();

    console.log("User created, id:", user._id.toString());

    if (!user) {
      res.status(401).json({ message: "User not created" });
    } else {
      const token = generateToken(user.id);
      res.status(201).json({ token: token, message: "OK" });
    }
  }
}
