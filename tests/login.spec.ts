import { test, expect } from "playwright/test";

test.describe("user logging in", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
  });
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
  // test("when loggin in with correct details, navigates to dashboard", async ({
  //   page,
  // }) => {

  // });
});
