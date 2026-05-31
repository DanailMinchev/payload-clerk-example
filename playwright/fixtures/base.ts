import { test as base } from "@playwright/test";
import { PostsApiClient } from "./posts-api-client";

type Fixtures = {
  allRolesPostsApiClient: PostsApiClient;
  superAdminPostsApiClient: PostsApiClient;
  adminPostsApiClient: PostsApiClient;
  editorPostsApiClient: PostsApiClient;
  authenticatedUserPostsApiClient: PostsApiClient;
  anonymousUserPostsApiClient: PostsApiClient;
};

export const test = base.extend<Fixtures>({
  allRolesPostsApiClient: async ({ playwright }, use) => {
    const apiRequestContext = await playwright.request.newContext({
      storageState: "playwright/.clerk/all-roles-1.json",
    });
    const postsApiClient = new PostsApiClient(apiRequestContext);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    await use(postsApiClient);

    await apiRequestContext.dispose();
  },

  superAdminPostsApiClient: async ({ playwright }, use) => {
    const apiRequestContext = await playwright.request.newContext({
      storageState: "playwright/.clerk/super-admin-1.json",
    });
    const postsApiClient = new PostsApiClient(apiRequestContext);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    await use(postsApiClient);

    await apiRequestContext.dispose();
  },

  adminPostsApiClient: async ({ playwright }, use) => {
    const apiRequestContext = await playwright.request.newContext({
      storageState: "playwright/.clerk/admin-1.json",
    });
    const postsApiClient = new PostsApiClient(apiRequestContext);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    await use(postsApiClient);

    await apiRequestContext.dispose();
  },

  editorPostsApiClient: async ({ playwright }, use) => {
    const apiRequestContext = await playwright.request.newContext({
      storageState: "playwright/.clerk/editor-1.json",
    });
    const postsApiClient = new PostsApiClient(apiRequestContext);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    await use(postsApiClient);

    await apiRequestContext.dispose();
  },

  authenticatedUserPostsApiClient: async ({ playwright }, use) => {
    const apiRequestContext = await playwright.request.newContext({
      storageState: "playwright/.clerk/user-1.json",
    });
    const postsApiClient = new PostsApiClient(apiRequestContext);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    await use(postsApiClient);

    await apiRequestContext.dispose();
  },

  anonymousUserPostsApiClient: async ({ playwright }, use) => {
    const apiRequestContext = await playwright.request.newContext();
    const postsApiClient = new PostsApiClient(apiRequestContext);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    await use(postsApiClient);

    await apiRequestContext.dispose();
  },
});

export { expect } from "@playwright/test";
