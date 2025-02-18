import { Browser } from "@playwright/test";
import { clerk, clerkSetup } from "@clerk/testing/playwright";

export async function authenticateUser(
  browser: Browser,
  identifier: string,
  password: string,
  storageStatePath: string,
) {
  const context = await browser.newContext();

  const page = await context.newPage();

  await clerkSetup();

  await page.goto("/");

  await clerk.signIn({
    page,
    signInParams: {
      strategy: "password",
      identifier,
      password,
    },
  });

  await page.goto("/profile");
  await page.waitForSelector("h1:has-text('Account')");

  await page.context().storageState({ path: storageStatePath });

  // await context.close();
}
