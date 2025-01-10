import JWT from "jsonwebtoken";
import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express-serve-static-core";
dotenv.config();
const secret = process.env.JWT_SECRET;

interface CustomRequest extends Request {
  user_id?: String;
}

export function tokenChecker(
  req: CustomRequest,
  res: Response,
  next: NextFunction
) {
  try {
    let token;
    const authHeader = req.get("Authorization");
    if (authHeader) {
      token = authHeader.slice(7);
    }

    if (!token) {
      res.status(401).send({ message: "invalid token" });
      return;
    }

    if (!secret) {
      res.status(401).send({ message: "no secret" });
      return;
    }

    const decoded = JWT.verify(token, secret) as { user_id: string };
    console.log(decoded)
    req.user_id = decoded.user_id;
    next();
  } catch (error) {
    console.log(error)
    res.status(401).send({ error: "Authentication Failed" });
  }
}
