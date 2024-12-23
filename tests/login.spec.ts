import { test, expect } from "playwright/test";

import Helpers from "./utils/helpers";
import { DatabaseHelper } from "./utils/db";
test.describe("user logging in", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    await DatabaseHelper.seedDb("users", [
      {
        email: "test_user@email.com",
        password: "password123",
        firstName: "John",
        lastName: "Smith",
      },
    ]);
  });
  test.afterAll(async () => {
    await DatabaseHelper.clearDb("users")
  })
  test("user fills in information", async ({ page }) => {
    // Fill out email field
    await page.getByLabel("Your Email").fill("test_user@email.com");
    await expect(page.getByLabel("Your Email")).toHaveValue(
      "test_user@email.com"
    );

    // Fill out password field

    await page.getByLabel("Password").fill("password123");
    await expect(page.getByLabel("Password")).toHaveValue("password123");
  });
  test("when loggin in, navigates to dashboard", async ({ page }) => {
    await Helpers.userLogsIn(page);
    await expect(page.getByText("Welcome")).toBeVisible()
  });
});
