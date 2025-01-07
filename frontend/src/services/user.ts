const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

interface Categories {
    expenses: string[];
    income: string[];
    savings: string[];
};

interface User {
  email: string;
  firstName: string;
  lastName: string;
  categories: {
    expenses: string[];
    income: string[];
    savings: string[];
  };
};

interface UserResponse {
  token: string;
  user: User;
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
    console.log("updated")
  }
  public static async getUserData(token: string): Promise<UserResponse> {
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

