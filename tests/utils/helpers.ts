import { expect, Page } from "playwright/test";

export default class Helpers {
  public static async newUserSignsUp(page: Page) {
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

    await page.getByRole("button", {name: "Sign Up"}).click()
  }
  public static async userLogsIn(page: Page) {
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

    await page.getByRole("button", {name: "Log In"}).click()
  }
}
