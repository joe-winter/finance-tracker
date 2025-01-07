const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

type Categories = {
    expenses: string[];
    income: string[];
    savings: string[];
};

export class UserService {
  public static async updateCategories(token: string, categories: Categories) {
    const requestOptions = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(categories)
    }
    const response = await fetch(`${BACKEND_URL}/user/categories`, requestOptions)

    if (response.status !==200) {
      throw new Error("Unable to update categories")
    }
  }
  public static async getUserData(token: string) {
        const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await fetch(`${BACKEND_URL}/user`, requestOptions);

    const data = await response.json();

    return data
  }
}

// type Transaction = {
//   date: string;
//   type: string;
//   category: string;
//   amount: number;
//   description: string;
// };

// export class TransactionsService {
//   public static async get(token: string) {
//     const requestOptions = {
//       method: "GET",
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     };
//     const response = await fetch(`${BACKEND_URL}/transactions`, requestOptions);

//     const data = await response.json();

//     return data
//   }

//   public static async add(token: string, transaction: Transaction) {
//     const requestOptions = {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(transaction),
//     };

//     const response = await fetch(`${BACKEND_URL}/transactions`, requestOptions);

//     if (response.status !== 201) {
//       throw new Error("Unable to add transaction");
//     }
//   }
// }
