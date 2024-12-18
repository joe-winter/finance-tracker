import { Request, Response } from "express-serve-static-core";
import { CreateUserDto } from "../dtos/CreateUser.dto";
import { UserType } from "../types/response";
import User from "../models/user";

export function getUsers(req: Request, res: Response) {
  res.send([]);
}

export function getUserById(req: Request, res: Response) {
  res.send({});
}

export async function createUser(
  req: Request<{}, {}, CreateUserDto>,
  res: Response<UserType>
) {
  const email = req.body.email;
  const password = req.body.password;
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  
  const user = new User({ email, password, firstname, lastname });

  await user.save()
  
  console.log("User created, id:", user._id.toString());
  res.status(201).json({ message: "OK" });
}
