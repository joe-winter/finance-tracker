import { Request, Response } from "express-serve-static-core";
import User from "../models/user";
import { generateToken } from "../lib/token";

export default class AuthenticationHandler {
  public static async createToken(
    req: Request<{}, {}, { email: string; password: string }>,
    res: Response<{ token?: string; message: string }>
  ) {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });

    if (!user) {
      res.status(401).json({ message: "User not found" });
    } else if (user.password !== password) {
      res.status(401).json({ message: "Password incorrect" });
    } else {
      const token = generateToken(user.id);
      res.status(201).json({ token: token, message: "OK" });
    }
  }
}
