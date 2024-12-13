import { generateToken, decodeToken } from "../../lib/token";

describe("TokenGenerator", () => {
  describe("jsonwebtoken", () => {
    test("returns a token containing user_id that is valid for 10 minutes", () => {
      const id_1: string = "1";
      const id_2: string = "2";

      // Encode tokens
      const token_1: string = generateToken(id_1);
      const token_2: string = generateToken(id_2);
      expect(token_1).not.toEqual(token_2);

      // Decode tokens
      const payload_1 = decodeToken(token_1);
      const payload_2 = decodeToken(token_2);

      if (payload_1 && payload_2) {
        expect(payload_1.user_id).toEqual(id_1);
        expect(payload_2.user_id).toEqual(id_2);

        // Token is valid for 600 seconds (10 minutes)
        if (payload_1.exp && payload_1.iat)
          expect(payload_1.exp - payload_1.iat).toEqual(600);
      }
    });
  });
});
