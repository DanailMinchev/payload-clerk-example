import { test as setup } from "@playwright/test";
import path from "path";
import { fileURLToPath } from "url";
import { authenticateUser } from "../playwright/lib/auth-helper";

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

// Setup must be run serially,
// this is necessary if Playwright is configured to run fully parallel: https://playwright.dev/docs/test-parallel
setup.describe.configure({ mode: "serial" });

setup("global setup", async ({}) => {
  if (
    !process.env.E2E_CLERK_ALL_ROLES_USER_EMAIL ||
    !process.env.E2E_CLERK_ALL_ROLES_USER_PASSWORD ||
    !process.env.E2E_CLERK_SUPER_ADMIN_USER_EMAIL ||
    !process.env.E2E_CLERK_SUPER_ADMIN_USER_PASSWORD ||
    !process.env.E2E_CLERK_ADMIN_USER_EMAIL ||
    !process.env.E2E_CLERK_ADMIN_USER_PASSWORD ||
    !process.env.E2E_CLERK_EDITOR_USER_EMAIL ||
    !process.env.E2E_CLERK_EDITOR_USER_PASSWORD ||
    !process.env.E2E_CLERK_AUTHENTICATED_USER_EMAIL ||
    !process.env.E2E_CLERK_AUTHENTICATED_USER_PASSWORD
  ) {
    throw new Error(
      "Please provide E2E_CLERK_*_USER_EMAIL and E2E_CLERK_*_USER_PASSWORD environment variables.",
    );
  }
});

const allRolesAuthFile = path.join(
  __dirname,
  "../playwright/.clerk/all-roles-1.json",
);
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

setup("authenticate - all-roles", async ({ browser }) => {
  await authenticateUser(
    browser,
    process.env.E2E_CLERK_ALL_ROLES_USER_EMAIL!,
    process.env.E2E_CLERK_ALL_ROLES_USER_PASSWORD!,
    allRolesAuthFile,
  );
});

setup("authenticate - super-admin", async ({ browser }) => {
  await authenticateUser(
    browser,
    process.env.E2E_CLERK_SUPER_ADMIN_USER_EMAIL!,
    process.env.E2E_CLERK_SUPER_ADMIN_USER_PASSWORD!,
    superAdminAuthFile,
  );
});

setup("authenticate - admin", async ({ browser }) => {
  await authenticateUser(
    browser,
    process.env.E2E_CLERK_ADMIN_USER_EMAIL!,
    process.env.E2E_CLERK_ADMIN_USER_PASSWORD!,
    adminAuthFile,
  );
});

setup("authenticate - editor", async ({ browser }) => {
  await authenticateUser(
    browser,
    process.env.E2E_CLERK_EDITOR_USER_EMAIL!,
    process.env.E2E_CLERK_EDITOR_USER_PASSWORD!,
    editorAuthFile,
  );
});

setup("authenticate - user", async ({ browser }) => {
  await authenticateUser(
    browser,
    process.env.E2E_CLERK_AUTHENTICATED_USER_EMAIL!,
    process.env.E2E_CLERK_AUTHENTICATED_USER_PASSWORD!,
    userAuthFile,
  );
});
