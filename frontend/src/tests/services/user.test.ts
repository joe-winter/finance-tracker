import createFetchMock from "vitest-fetch-mock";

import { UserService } from "../../services/user";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

createFetchMock(vi).enableMocks();

describe("user service", () => {
  describe("updateCategories", () => {
    it("includes a token and category object in its request", async () => {
      fetchMock.mockResponseOnce(
        JSON.stringify({ message: "categories updated", token: "newToken" }),
        { status: 200 }
      );

      const categories = {
        expenses: ["car", "food", "bills"],
        income: ["freelance", "employment"],
        savings: ["savings", "fund"],
      };

      await UserService.updateCategories("testToken", categories)

      const fetchArgs = fetchMock.mock.lastCall
      const url = fetchArgs?.[0]
      const options = fetchArgs?.[1]

      expect(url).toEqual(`${BACKEND_URL}/user/categories`)
      expect(options).toMatchObject({
        method: "POST",
        body: JSON.stringify({
          expenses: ["car", "food", "bills"],
          income: ["freelance", "employment"],
          savings: ["savings", "fund"],
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer testToken",
        },
      })
    });
        it("throws error if status is not 201", async () => {
          fetchMock.mockResponseOnce(
            JSON.stringify({ message: "Something went wrong" }),
            { status: 400 }
          );
    
          const categories = {
            expenses: ["car", "food", "bills"],
            income: ["freelance", "employment"],
            savings: ["savings", "fund"],
          };
    
          try {
            await UserService.updateCategories("testToken", categories)
          } catch (err: unknown) {
            if (err instanceof Error) {
              expect(err.message).toEqual("Unable to add transaction");
            }
          }
        });
  });
});
