import { test } from "@playwright/test";

// Use prepared Clerk auth state
test.use({ storageState: "playwright/.clerk/all-roles-1.json" });

test.describe("all-roles auth tests", () => {
  test("dashboard test", async ({ page }) => {
    await page.goto("/admin");

    await page.waitForURL("**/admin");
    await page.waitForSelector("h2:has-text('Collections')");

    await page.goto("/admin/clerk-users");
    await page.waitForURL("**/admin/clerk-users");
    await page.waitForSelector("h1:has-text('Users')");
  });
});
