import createFetchMock from "vitest-fetch-mock";

import { DataService } from "@/services/data";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

createFetchMock(vi).enableMocks();

describe("data service", () => {
  describe("getTotals", () => {
    it("includes a token in its request", async () => {
      fetchMock.mockResponseOnce(
        JSON.stringify({ totals: {}, token: "newToken" }),
        { status: 200 }
      );

      const response = await DataService.getTotals("testToken")

      const fetchArgs = fetchMock.mock.lastCall;
      const url = fetchArgs?.[0];
      const options = fetchArgs?.[1];

      expect(url).toEqual(`${BACKEND_URL}/data/totals`);
      expect(options).toMatchObject({
        method: "GET",
        headers: {
          Authorization: "Bearer testToken",
        },
      });

      expect(response.totals).toEqual({});
      expect(response.token).toEqual("newToken");
    })
    it("includes query params in its request", async () => {
      fetchMock.mockResponseOnce(
        JSON.stringify({ totals: {}, token: "newToken" }),
        { status: 200 }
      );

      const response = await DataService.getTotals("testToken", "2024-01-15", "2024-01-20")
      

      const fetchArgs = fetchMock.mock.lastCall;
      const url = fetchArgs?.[0];
      const options = fetchArgs?.[1];

      expect(url).toEqual(`${BACKEND_URL}/data/totals?startDate=2024-01-15&endDate=2024-01-20`);
      expect(options).toMatchObject({
        method: "GET",
        headers: {
          Authorization: "Bearer testToken",
        },
      });

      expect(response.totals).toEqual({});
      expect(response.token).toEqual("newToken");
    })
  })
});
