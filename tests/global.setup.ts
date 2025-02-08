import { clerk, clerkSetup } from "@clerk/testing/playwright";
import { test as setup } from "@playwright/test";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

// Setup must be run serially, this is necessary if Playwright is configured to run fully parallel: https://playwright.dev/docs/test-parallel
setup.describe.configure({ mode: "serial" });

setup("global setup", async ({}) => {
  await clerkSetup();

  if (
    !process.env.E2E_CLERK_SUPER_ADMIN_USER_EMAIL ||
    !process.env.E2E_CLERK_SUPER_ADMIN_USER_PASSWORD ||
    !process.env.E2E_CLERK_ADMIN_USER_EMAIL ||
    !process.env.E2E_CLERK_ADMIN_USER_PASSWORD ||
    !process.env.E2E_CLERK_EDITOR_USER_EMAIL ||
    !process.env.E2E_CLERK_EDITOR_USER_PASSWORD ||
    !process.env.E2E_CLERK_APP_USER_EMAIL ||
    !process.env.E2E_CLERK_APP_USER_PASSWORD
  ) {
    throw new Error(
      "Please provide E2E_CLERK_*_USER_EMAIL and E2E_CLERK_*_USER_PASSWORD environment variables.",
    );
  }
});

const superAdminAuthFile = path.join(
  __dirname,
  "../playwright/.clerk/super-admin-1.json",
);
const adminAuthFile = path.join(__dirname, "../playwright/.clerk/admin-1.json");
const editorAuthFile = path.join(
  __dirname,
  "../playwright/.clerk/editor-1.json",
);
const userAuthFile = path.join(__dirname, "../playwright/.clerk/user-1.json");

setup("authenticate - super-admin", async ({ page }) => {
  await page.goto("/");

  await clerk.signIn({
    page,
    signInParams: {
      strategy: "password",
      identifier: process.env.E2E_CLERK_SUPER_ADMIN_USER_EMAIL!,
      password: process.env.E2E_CLERK_SUPER_ADMIN_USER_PASSWORD!,
    },
  });

  await page.goto("/profile");

  await page.waitForSelector("h1:has-text('Account')");

  await page.context().storageState({ path: superAdminAuthFile });
});

setup("authenticate - admin", async ({ page }) => {
  await page.goto("/");

  await clerk.signIn({
    page,
    signInParams: {
      strategy: "password",
      identifier: process.env.E2E_CLERK_ADMIN_USER_EMAIL!,
      password: process.env.E2E_CLERK_ADMIN_USER_PASSWORD!,
    },
  });

  await page.goto("/profile");

  await page.waitForSelector("h1:has-text('Account')");

  await page.context().storageState({ path: adminAuthFile });
});

setup("authenticate - editor", async ({ page }) => {
  await page.goto("/");

  await clerk.signIn({
    page,
    signInParams: {
      strategy: "password",
      identifier: process.env.E2E_CLERK_EDITOR_USER_EMAIL!,
      password: process.env.E2E_CLERK_EDITOR_USER_PASSWORD!,
    },
  });

  await page.goto("/profile");

  await page.waitForSelector("h1:has-text('Account')");

  await page.context().storageState({ path: editorAuthFile });
});

setup("authenticate - user", async ({ page }) => {
  await page.goto("/");

  await clerk.signIn({
    page,
    signInParams: {
      strategy: "password",
      identifier: process.env.E2E_CLERK_APP_USER_EMAIL!,
      password: process.env.E2E_CLERK_APP_USER_PASSWORD!,
    },
  });

  await page.goto("/profile");

  await page.waitForSelector("h1:has-text('Account')");

  await page.context().storageState({ path: userAuthFile });
});
