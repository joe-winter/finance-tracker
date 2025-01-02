const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

type Transaction = {
  date: Date;
  type: string;
  category: string;
  amount: number;
  description: string;
  balance: number;
}

export class TransactionsService {
  public static async get() {

  }

  
  public static async add(token: string, transaction: Transaction) {
    const requestOptions = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(transaction),
    };
    
    const response = await fetch(`${BACKEND_URL}/transactions`, requestOptions); // /posts refers to all the routes related to posts
  
    if (response.status !== 201) {
      throw new Error("Unable to add transaction");
    }
  }


}