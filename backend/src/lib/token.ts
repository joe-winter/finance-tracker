import JWT from "jsonwebtoken";
const secret = process.env.JWT_SECRET as string;

/**
 * This function is used to generate a JWT authentication
 * token for a specific user.
 * JWTs in 100 Seconds: https://www.youtube.com/watch?v=UBUNrFtufWo
 */
function generateToken(user_id: string): string {
  if (user_id) {
    return JWT.sign(
      {
        user_id: user_id,
        iat: Math.floor(Date.now() / 1000),

        // Set the JWT token to expire in 10 minutes
        exp: Math.floor(Date.now() / 1000) + 10 * 60,
      },
      secret
    );
  } else {
    throw new Error("Unable to generate a token.");
  }
}

function decodeToken(token: string): JWT.JwtPayload | null {
  return JWT.decode(token) as JWT.JwtPayload | null;
}

export { generateToken, decodeToken };
