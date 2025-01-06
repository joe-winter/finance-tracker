import createFetchMock from "vitest-fetch-mock";

import { TransactionsService } from "../../services/transactions";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

createFetchMock(vi).enableMocks();

describe("transaction service", () => {
  describe("add", () => {
    it("includes a token and transaction object in its request", async () => {
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
      };

      try {
        await TransactionsService.add("testToken", transaction);
      } catch (err: unknown) {
        if (err instanceof Error) {
          expect(err.message).toEqual("Unable to add transaction");
        }
      }
    });
  });
  describe("get", () => {
    it("includes a token in its request", async () => {
      fetchMock.mockResponseOnce(
        JSON.stringify({ transactions: {}, token: "newToken" }),
        { status: 200 }
      );

      const response = await TransactionsService.get("testToken");

      const fetchArgs = fetchMock.mock.lastCall;
      const url = fetchArgs?.[0];
      const options = fetchArgs?.[1];

      expect(url).toEqual(`${BACKEND_URL}/transactions`);
      expect(options).toMatchObject({
        method: "GET",
        headers: {
          Authorization: "Bearer testToken",
        },
      });

      expect(response.transactions).toEqual({});
      expect(response.token).toEqual("newToken");
    });
    it("rejects with an error if the status is not 200", async () => {
      fetchMock.mockResponseOnce(
        JSON.stringify({ message: "Something went wrong" }),
        { status: 400 }
      );
      try {
        await TransactionsService.get("testToken");
      } catch (err: unknown) {
        if (err instanceof Error) {
          expect(err.message).toEqual("Unable to fetch transactions");
        }
      }
    });
  });
});
