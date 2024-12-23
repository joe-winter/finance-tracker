import { test, expect } from "playwright/test";
import Helpers from "./utils/helpers";
import { DatabaseHelper } from "./utils/db";

test.describe("user signing up", () => {
  test.beforeEach( async ({ page }) => {
    await page.goto("/signup");
    await DatabaseHelper.clearDb("users")
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
    await page.getByLabel("Password", { exact: true }).fill("password123");
    await expect(page.getByLabel("Password", { exact: true })).toHaveValue(
      "password123"
    );
    // Fill out confrim passowrd field
    await page
      .getByLabel("Confirm Password", { exact: true })
      .fill("password123");
    await expect(
      page.getByLabel("Confirm Password", { exact: true })
    ).toHaveValue("password123");
    // Fill out first name field
    await page.getByLabel("First Name").fill("Test");
    await expect(page.getByLabel("First Name")).toHaveValue("Test");
    // Fill out last name field
    await page.getByLabel("Last Name").fill("User");
    await expect(page.getByLabel("Last Name")).toHaveValue("User");
  });
  test("a user creates an account and is navigated to dashboard", async ({ page }) => {
    await Helpers.newUserSignsUp(page)

    await expect(page.getByText("Welcome")).toBeVisible()
  });
});
