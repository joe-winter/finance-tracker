// import createFetchMock from "vitest-fetch-mock"

import { login, signUp } from "../../services/authentication";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// createFetchMock(vi).enableMocks()

describe("Authentication Service", () => {
  describe("login", () => {
    it("calls the backend url for a token", async () => {
      const testEmail = "test@email.com";
      const testPassword = "Password1";

      fetchMock.mockResponseOnce(JSON.stringify({ token: "testToken" }), {
        status: 201,
      });
      await login(testEmail, testPassword);

      const fetchArgs = fetchMock.mock.lastCall;
      const url = fetchArgs[0];
      const options = fetchArgs[1];

      expect(url).toEqual(`${BACKEND_URL}/tokens`);
      expect(options.method).toEqual("POST");
      expect(options.body).toEqual(
        JSON.stringify({ email: testEmail, password: testPassword })
      );
      expect(options.headers["Content-Type"]).toEqual("application/json");
    });

    it("returns the token if the request was a success", async () => {
      const testEmail = "test@email.com";
      const testPassword = "Password1";

      fetchMock.mockResponseOnce(JSON.stringify({ token: "testToken" }), {
        status: 201,
      });

      const token = await login(testEmail, testPassword);
      expect(token).toEqual("testToken");
    });

    it("throws an error if the request failed", async () => {
      const testEmail = "test@email.com";
      const testPassword = "Password1";

      fetchMock.mockResponseOnce(
        JSON.stringify({ message: "Wrong Password" }),
        {
          status: 403,
        }
      );

      try {
        await login(testEmail, testPassword);
      } catch (err: unknown) {
        if (err instanceof Error) {
          expect(err.message).toEqual(
            "Received status 403 when logging in. Expected 201"
          );
        }
      }
    });
  });
  describe("signup", () => {
    it("calls the backend url for a token", async () => {
      const testEmail = "test@testEmail.com";
      const testPassword = "12345678";
      const testFirstName = "TestFirstName";
      const testLastName = "TestLastName";

      fetchMock.mockResponseOnce(JSON.stringify({ token: "testToken" }), {
        status: 201,
      });

      await signUp(
        testEmail,
        testPassword,
        testFirstName,
        testLastName,
      );

      // This is an array of the arguments that were last passed to fetch
      const fetchArguments = fetchMock.mock.lastCall;
      const url = fetchArguments[0];
      const options = fetchArguments[1];

      expect(url).toEqual(`${BACKEND_URL}/users`);
      expect(options.method).toEqual("POST");
      expect(options.body).toEqual(
        JSON.stringify({
          email: testEmail,
          password: testPassword,
          firstName: testFirstName,
          lastName: testLastName,
        })
      );
      expect(options.headers["Content-Type"]).toEqual("application/json");
    });

    it("returns token if the signup request was a success", async () => {
      const testEmail = "test@testEmail.com";
      const testPassword = "12345678";
      const testFirstName = "TestFirstName";
      const testLastName = "TestLastName";

  
        fetchMock.mockResponseOnce(JSON.stringify({ token: "testToken" }), {
          status: 201,
        });


      const token = await signUp(
        testEmail,
        testPassword,
        testFirstName,
        testLastName,
      );
      expect(token).toEqual("testToken");
    });

    it("throws an error if the request failed", async () => {
      const testEmail = "test@testEmail.com";
      const testPassword = "12345678";
      const testFirstName = "TestFirstName";
      const testLastName = "TestLastName";

      fetchMock.mockResponseOnce(
        JSON.stringify({ message: "User already exists" }),
        {
          status: 400,
        }
      );

      try {
        await signUp(
          testEmail,
          testPassword,
          testFirstName,
          testLastName,
        );
      } catch (err: unknown) {
        if (err instanceof Error) {
          expect(err.message).toEqual(
            "Received status 400 when signing up. Expected 201"
          );
        }
      }
    });
  });
});
