import { test } from "@playwright/test";

// Use prepared Clerk auth state
test.use({ storageState: "playwright/.clerk/user-1.json" });

test.describe("user auth tests", () => {
  test("dashboard test", async ({ page }) => {
    await page.goto("/admin");

    await page.waitForURL("**/admin/unauthorized");
    await page.waitForSelector("h1:has-text('Unauthorized')");
  });
});
