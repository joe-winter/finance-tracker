import { Request, Response } from "express-serve-static-core";
import { CreateUserDto } from "../dtos/CreateUser.dto";
import { User } from "../types/response";

export function getUsers(req: Request, res: Response) {
  res.send([]);
}

export function getUserById(req: Request, res: Response) {
  res.send({});
}

export function createUser(
  req: Request<{}, {}, CreateUserDto>,
  res: Response<User>
) {
  res.status(201).send({
    id: 1,
    username: "joe",
    email: "joe@email.com",
  });
}
