import { expect, test } from "@playwright/test";
import { Post } from "@/payload-types";
import { nanoid } from "nanoid";
import { Where } from "payload";
import { PostsApiClient } from "../../../../playwright/fixtures/posts-api-client";
import { authenticateUser } from "../../../../playwright/lib/auth-helper";

test.describe("authenticated user /api/posts api tests", () => {
  let allRolesPostsApiClient: PostsApiClient;
  let authenticatedUserPostsApiClient: PostsApiClient;
  let postOnePublished: Post | null;
  let postTwoDraft: Post | null;

  test.beforeEach(async ({ playwright, browser }) => {
    await authenticateUser(
      browser,
      process.env.E2E_CLERK_ALL_ROLES_USER_EMAIL!,
      process.env.E2E_CLERK_ALL_ROLES_USER_PASSWORD!,
      "playwright/.clerk/all-roles-1.json",
    );
    allRolesPostsApiClient = new PostsApiClient(
      await playwright.request.newContext({
        storageState: "playwright/.clerk/all-roles-1.json",
      }),
    );

    await authenticateUser(
      browser,
      process.env.E2E_CLERK_AUTHENTICATED_USER_EMAIL!,
      process.env.E2E_CLERK_AUTHENTICATED_USER_PASSWORD!,
      "playwright/.clerk/user-1.json",
    );
    authenticatedUserPostsApiClient = new PostsApiClient(
      await playwright.request.newContext({
        storageState: "playwright/.clerk/user-1.json",
      }),
    );

    // POST /api/{collection-slug} - postOnePublished
    const postOneTitle = `Title 1 - ${nanoid()}`;
    postOnePublished = await allRolesPostsApiClient.create({
      _status: "published",
      title: postOneTitle,
    });

    expect(postOnePublished).toEqual(
      expect.objectContaining({
        createdBy: expect.objectContaining({
          emailAddresses: [process.env.E2E_CLERK_ALL_ROLES_USER_EMAIL],
        }),
        _status: "published",
        title: postOneTitle,
      }),
    );

    // POST /api/{collection-slug} - postTwoDraft
    const postTwoTitle = `Title 2 - ${nanoid()}`;
    postTwoDraft = await allRolesPostsApiClient.create({
      _status: "draft",
      title: postTwoTitle,
    });

    expect(postTwoDraft).toEqual(
      expect.objectContaining({
        createdBy: expect.objectContaining({
          emailAddresses: [process.env.E2E_CLERK_ALL_ROLES_USER_EMAIL],
        }),
        _status: "draft",
        title: postTwoTitle,
      }),
    );
  });

  test.afterEach(async () => {
    if (postOnePublished) {
      await allRolesPostsApiClient.deleteById(postOnePublished.id);
    }
    if (postTwoDraft) {
      await allRolesPostsApiClient.deleteById(postTwoDraft.id);
    }
  });

  test("should find all (published only)", async () => {
    if (!postOnePublished || !postTwoDraft) {
      return;
    }

    const findAllPosts = await authenticatedUserPostsApiClient.findAll({
      or: [
        {
          id: {
            equals: postOnePublished.id,
          },
        },
        {
          id: {
            equals: postTwoDraft.id,
          },
        },
      ],
    });

    expect(findAllPosts.length).toBeGreaterThan(0);
    expect(findAllPosts).toContainEqual(
      expect.objectContaining({
        ...postOnePublished,
        createdBy: expect.any(Number),
      }),
    );
    expect(findAllPosts).not.toContainEqual(
      expect.objectContaining({
        id: postTwoDraft.id,
      }),
    );
  });

  test("should find by id (published)", async () => {
    if (!postOnePublished) {
      return;
    }

    const foundPost = await authenticatedUserPostsApiClient.findById(
      postOnePublished.id,
    );

    expect(foundPost).toEqual(
      expect.objectContaining({
        ...postOnePublished,
        createdBy: expect.any(Number),
      }),
    );
  });

  test("should not find by id (draft)", async () => {
    if (!postTwoDraft) {
      return;
    }

    const foundPost = await authenticatedUserPostsApiClient.findById(
      postTwoDraft.id,
    );

    expect(foundPost).toBeNull();
  });

  test("should count (published only)", async () => {
    const count = await authenticatedUserPostsApiClient.count();

    expect(count.totalDocs).toBeGreaterThanOrEqual(1);
  });

  test("should not create", async () => {
    const newPostTitle = `Title 1 - ${nanoid()}`;
    const createdNewPost = await authenticatedUserPostsApiClient.create(
      {
        _status: "published",
        title: newPostTitle,
      },
      "403",
    );

    expect(createdNewPost).toBeNull();
  });

  test("should not update all", async () => {
    if (!postOnePublished || !postTwoDraft) {
      return;
    }

    const updateAllQuery: Where = {
      or: [
        {
          id: {
            equals: postOnePublished.id,
          },
        },
        {
          id: {
            equals: postTwoDraft.id,
          },
        },
      ],
    };
    const updatedTitle = "Updated title";
    const updatedPosts = await authenticatedUserPostsApiClient.updateAll(
      updateAllQuery,
      {
        title: updatedTitle,
      },
    );

    expect(updatedPosts).toHaveLength(0);
  });

  test("should not update by id", async () => {
    if (!postOnePublished) {
      return;
    }

    const updatedTitle = `Updated title - ${postOnePublished.id}`;
    const updatedPost = await authenticatedUserPostsApiClient.updateById(
      postOnePublished.id,
      {
        title: updatedTitle,
      },
      "403",
    );

    expect(updatedPost).toBeNull();
  });

  test("should not delete all", async () => {
    if (!postOnePublished || !postTwoDraft) {
      return;
    }

    const deleteAllQuery: Where = {
      or: [
        {
          id: {
            equals: postOnePublished.id,
          },
        },
        {
          id: {
            equals: postTwoDraft.id,
          },
        },
      ],
    };

    const deletedPosts =
      await authenticatedUserPostsApiClient.deleteAll(deleteAllQuery);

    expect(deletedPosts).toHaveLength(0);
  });

  test("should not delete by id", async () => {
    if (!postOnePublished) {
      return;
    }

    await authenticatedUserPostsApiClient.deleteById(
      postOnePublished.id,
      "403",
    );
  });

  test("should not find all versions", async () => {
    if (!postOnePublished || !postTwoDraft) {
      return;
    }

    const findAllDocs = await authenticatedUserPostsApiClient.findAllVersions(
      {
        or: [
          {
            parent: {
              equals: postOnePublished.id,
            },
          },
          {
            parent: {
              equals: postTwoDraft.id,
            },
          },
        ],
      },
      "403",
    );

    expect(findAllDocs).toBeNull();
  });

  test("should not find version by id", async () => {
    if (!postTwoDraft) {
      return;
    }

    const findAllDocs = await allRolesPostsApiClient.findAllVersions({
      parent: {
        equals: postTwoDraft.id,
      },
      latest: {
        equals: true,
      },
    });
    expect(findAllDocs).not.toBeNull();
    expect(findAllDocs?.length).toEqual(1);

    if (findAllDocs && findAllDocs.length > 0) {
      const foundVersion =
        await authenticatedUserPostsApiClient.findVersionById(
          findAllDocs[0].id,
          "403",
        );

      expect(foundVersion).toBeNull();
    }
  });

  test("should not restore version by id", async () => {
    if (!postTwoDraft) {
      return;
    }

    const findAllDocs = await allRolesPostsApiClient.findAllVersions({
      parent: {
        equals: postTwoDraft.id,
      },
      latest: {
        equals: true,
      },
    });
    expect(findAllDocs).not.toBeNull();
    expect(findAllDocs?.length).toEqual(1);

    if (findAllDocs && findAllDocs.length > 0) {
      await authenticatedUserPostsApiClient.restoreVersionById(
        findAllDocs[0].id,
        "403",
      );
    }
  });
});
