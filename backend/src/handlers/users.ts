import { Request, Response } from "express-serve-static-core";
import { CreateUserDto } from "../dtos/CreateUser.dto";
import { UserType } from "../types/response";
import User from "../models/user";

export default class UsersController {
  public static getUserById(req: Request, res: Response) {
    res.send({});
  }

  public static async createUser(
    req: Request<{}, {}, CreateUserDto>,
    res: Response<UserType>
  ) {
    // const email = req.body.email;
    // const password = req.body.password;
    // const firstname = req.body.firstname;
    // const lastname = req.body.lastname;
    const { email, password, firstname, lastname } = req.body;

    const user = new User({ email, password, firstname, lastname });

    await user.save();

    console.log("User created, id:", user._id.toString());
    res.status(201).json({ message: "OK" });
  }
}
