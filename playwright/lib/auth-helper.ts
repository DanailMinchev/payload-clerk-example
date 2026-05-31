import { mkdir } from "node:fs/promises";
import path from "node:path";
import type { Browser } from "@playwright/test";
import {
  clerk,
  clerkSetup,
  setupClerkTestingToken,
} from "@clerk/testing/playwright";

export async function authenticateUser(
  browser: Browser,
  identifier: string,
  password: string,
  storageStatePath: string,
) {
  const context = await browser.newContext();

  const page = await context.newPage();

  await clerkSetup();
  await setupClerkTestingToken({ page });

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
  await clerk.loaded({ page });
  await page.waitForSelector(".cl-userProfile-root");

  await mkdir(path.dirname(storageStatePath), { recursive: true });
  await page.context().storageState({ path: storageStatePath });

  await context.close();
}
