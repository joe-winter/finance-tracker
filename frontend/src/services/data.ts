const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

interface Totals {
  expenses: { total: number; categories: { [category: string]: number } };
  income: { total: number; categories: { [category: string]: number } };
  savings: { total: number; categories: { [category: string]: number } };
}
interface TotalsResponse {
  token: string;
  totals: Totals;
}

export class DataService {
  public static async getTotals(
    token: string,
    startDate: string = "",
    endDate: string = ""
  ): Promise<TotalsResponse> {
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    if (startDate && endDate) {
      const response = await fetch(
        `${BACKEND_URL}/data/totals?startDate=${startDate}&endDate=${endDate}`,
        requestOptions
      );

      const data = await response.json();

      return data;
    } else {
      const response = await fetch(
        `${BACKEND_URL}/data/totals`,
        requestOptions
      );

      const data = await response.json();

      return data;
    }
  }
}
