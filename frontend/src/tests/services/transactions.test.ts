import createFetchMock from "vitest-fetch-mock";

import { TransactionsService } from "../../services/transactions";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

createFetchMock(vi).enableMocks();

describe("transaction service", () => {
  describe("add", () => {
    it("includes a token and user id in request", async () => {
      fetchMock.mockResponseOnce(
        JSON.stringify({ message: "transaction created", token: "newToken" }),
        { status: 201 }
      );

      const transaction = {
        date: new Date("2024-1-1"),
        type: "expenses",
        category: "car",
        amount: 59.99,
        description: "new tire",
        balance: 1234.45,
      };

      await TransactionsService.add("testToken", transaction);

      const fetchArgs = fetchMock.mock.lastCall;
      const url = fetchArgs?.[0];
      const options = fetchArgs?.[1];

      expect(url).toEqual(`${BACKEND_URL}/transactions`);
      expect(options).toMatchObject({
        method: "POST",
        body: JSON.stringify({
          date: new Date("2024-1-1"),
          type: "expenses",
          category: "car",
          amount: 59.99,
          description: "new tire",
          balance: 1234.45,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer testToken",
        },
      });
    });
    it("throws error if status is not 201", async () => {
      fetchMock.mockResponseOnce(
        JSON.stringify({ message: "Something went wrong" }),
        { status: 400 }
      );

      const transaction = {
        date: new Date("2024-1-1"),
        type: "expenses",
        category: "car",
        amount: 59.99,
        description: "new tire",
        balance: 1234.45,
      };

      try {
        await TransactionsService.add("testToken", transaction);
      } catch (err: unknown) {
        if (err instanceof Error) {
          expect(err.message).toEqual(
            "Unable to add transaction"
          );
        }
      }
    });
  });
});
