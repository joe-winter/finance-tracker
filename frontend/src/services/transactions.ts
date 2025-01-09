const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

type Transaction = {
  date: string;
  type: string;
  category: string;
  amount: string;
  description: string;
};

export class TransactionsService {
  public static async get(token: string) {
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await fetch(`${BACKEND_URL}/transactions`, requestOptions);

    const data = await response.json();

    return data
  }

  public static async add(token: string, transaction: Transaction) {
    if (
      !transaction.date ||
      !transaction.type ||
      !transaction.category ||
      !transaction.description ||
      !transaction.amount
    ) {
      console.log("Must enter valid transaction")
      return;
    }
    const requestOptions = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(transaction),
    };
    

    const response = await fetch(`${BACKEND_URL}/transactions`, requestOptions);

    if (response.status !== 201) {
      throw new Error("Unable to add transaction");
    }
  }
}
