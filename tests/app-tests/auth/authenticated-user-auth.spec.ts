import { expect, test } from "@playwright/test";

test.describe("authenticated user tests", () => {
  test("dashboard test", async ({ page }) => {
    await page.goto("/admin");

    await page.waitForURL("**/login**");
    await expect(page.locator("h1")).toContainText("Sign in");

    await page.waitForSelector(".cl-signIn-root", { state: "attached" });
    await page
      .locator("input[name=identifier]")
      .fill(process.env.E2E_CLERK_AUTHENTICATED_USER_EMAIL!);
    await page.getByRole("button", { name: "Continue", exact: true }).click();
    await page
      .locator("input[name=password]")
      .fill(process.env.E2E_CLERK_AUTHENTICATED_USER_PASSWORD!);
    await page.getByRole("button", { name: "Continue", exact: true }).click();

    await page.waitForURL("**/admin/unauthorized");
    await page.waitForSelector("h1:has-text('Unauthorized')");

    await page.getByRole("link", { name: "Log out" }).click();
    await page.waitForURL("**/admin/logout");

    await page.waitForSelector("h1:has-text('Payload CMS and Clerk example')");
  });
});
