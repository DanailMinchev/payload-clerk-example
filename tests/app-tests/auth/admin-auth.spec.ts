import { test } from "@playwright/test";

// Use prepared Clerk auth state
test.use({ storageState: "playwright/.clerk/admin-1.json" });

test.describe("admin auth tests", () => {
  test("dashboard test", async ({ page }) => {
    await page.goto("/admin");

    await page.waitForURL("**/admin");
    await page.waitForSelector("h2:has-text('Collections')");
  });
});
