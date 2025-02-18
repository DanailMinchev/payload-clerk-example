import { expect, test } from "../../../playwright/fixtures/base";
import { Post } from "@/payload-types";
import { nanoid } from "nanoid";
import { Where } from "payload";
import { test as base } from "@playwright/test";

test.describe("admin role /api/posts api tests", () => {
  let postOnePublished: Post | null;
  let postTwoDraft: Post | null;

  test.beforeEach(async ({ adminPostsApiClient }) => {
    // POST /api/{collection-slug} - postOnePublished
    const postOneTitle = `Title 1 - ${nanoid()}`;
    postOnePublished = await adminPostsApiClient.create({
      _status: "published",
      title: postOneTitle,
    });

    expect(postOnePublished).toEqual(
      expect.objectContaining({
        createdBy: expect.objectContaining({
          emailAddresses: [process.env.E2E_CLERK_ADMIN_USER_EMAIL],
        }),
        _status: "published",
        title: postOneTitle,
      }),
    );

    // POST /api/{collection-slug} - postTwoDraft
    const postTwoTitle = `Title 2 - ${nanoid()}`;
    postTwoDraft = await adminPostsApiClient.create({
      _status: "draft",
      title: postTwoTitle,
    });

    expect(postTwoDraft).toEqual(
      expect.objectContaining({
        createdBy: expect.objectContaining({
          emailAddresses: [process.env.E2E_CLERK_ADMIN_USER_EMAIL],
        }),
        _status: "draft",
        title: postTwoTitle,
      }),
    );
  });

  test.afterEach(async ({ adminPostsApiClient }) => {
    if (postOnePublished) {
      await adminPostsApiClient.deleteById(postOnePublished.id);
    }
    if (postTwoDraft) {
      await adminPostsApiClient.deleteById(postTwoDraft.id);
    }
  });

  test("should find all (published and draft)", async ({
    adminPostsApiClient,
  }) => {
    if (!postOnePublished || !postTwoDraft) {
      return;
    }

    const findAllPosts = await adminPostsApiClient.findAll({
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
      }),
    );
    expect(findAllPosts).toContainEqual(
      expect.objectContaining({
        ...postTwoDraft,
      }),
    );
  });

  test("should find by id (published)", async ({ adminPostsApiClient }) => {
    if (!postOnePublished) {
      return;
    }

    const foundPost = await adminPostsApiClient.findById(postOnePublished.id);

    expect(foundPost).toEqual(postOnePublished);
  });

  test("should find by id (draft)", async ({ adminPostsApiClient }) => {
    if (!postTwoDraft) {
      return;
    }

    const foundPost = await adminPostsApiClient.findById(postTwoDraft.id);

    expect(foundPost).toEqual(postTwoDraft);
  });

  test("should count", async ({ adminPostsApiClient }) => {
    const count = await adminPostsApiClient.count();

    expect(count.totalDocs).toBeGreaterThanOrEqual(2);
  });

  test("should update all", async ({ adminPostsApiClient }) => {
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
    const updatedPosts = await adminPostsApiClient.updateAll(updateAllQuery, {
      title: updatedTitle,
    });

    expect(updatedPosts?.length).toEqual(2);
    expect(updatedPosts).toContainEqual(
      expect.objectContaining({
        id: postOnePublished.id,
        title: updatedTitle,
      }),
    );
    expect(updatedPosts).toContainEqual(
      expect.objectContaining({
        id: postTwoDraft.id,
        title: updatedTitle,
      }),
    );
  });

  test("should update by id (own data)", async ({ adminPostsApiClient }) => {
    if (!postOnePublished) {
      return;
    }

    const updatedTitle = `Updated title - ${postOnePublished.id}`;
    const updatedPost = await adminPostsApiClient.updateById(
      postOnePublished.id,
      {
        title: updatedTitle,
      },
    );

    expect(updatedPost).toEqual(
      expect.objectContaining({
        id: postOnePublished.id,
        title: updatedTitle,
      }),
    );
  });

  test("should update by id (other's data)", async ({
    allRolesPostsApiClient,
    adminPostsApiClient,
  }) => {
    const anotherPostTitle = `Another title - ${nanoid()}`;
    const anotherPost = await allRolesPostsApiClient.create({
      _status: "published",
      title: anotherPostTitle,
    });

    if (!anotherPost) {
      return;
    }

    expect(anotherPost).toEqual(
      expect.objectContaining({
        createdBy: expect.objectContaining({
          emailAddresses: [process.env.E2E_CLERK_ALL_ROLES_USER_EMAIL],
        }),
        _status: "published",
        title: anotherPostTitle,
      }),
    );

    const updatedTitle = `Updated title - ${anotherPost.id}`;
    const updatedPost = await adminPostsApiClient.updateById(anotherPost.id, {
      title: updatedTitle,
    });

    expect(updatedPost).toEqual(
      expect.objectContaining({
        id: anotherPost.id,
        title: updatedTitle,
      }),
    );

    await allRolesPostsApiClient.deleteById(anotherPost.id);
  });

  test("should delete all", async ({ adminPostsApiClient }) => {
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

    const deletedPosts = await adminPostsApiClient.deleteAll(deleteAllQuery);
    expect(deletedPosts?.length).toEqual(2);
    expect(deletedPosts).toContainEqual(
      expect.objectContaining({
        id: postOnePublished.id,
      }),
    );
    expect(deletedPosts).toContainEqual(
      expect.objectContaining({
        id: postTwoDraft.id,
      }),
    );
  });

  test("should delete by id (own data)", async ({ adminPostsApiClient }) => {
    if (!postOnePublished) {
      return;
    }

    await adminPostsApiClient.deleteById(postOnePublished.id);

    const foundAnotherPost = await adminPostsApiClient.findById(
      postOnePublished.id,
    );
    expect(foundAnotherPost).toBeNull();
  });

  test("should delete by id (other's data)", async ({
    allRolesPostsApiClient,
    adminPostsApiClient,
  }) => {
    const anotherPostTitle = `Another title - ${nanoid()}`;
    const anotherPost = await allRolesPostsApiClient.create({
      _status: "published",
      title: anotherPostTitle,
    });

    expect(anotherPost).toEqual(
      expect.objectContaining({
        createdBy: expect.objectContaining({
          emailAddresses: [process.env.E2E_CLERK_ALL_ROLES_USER_EMAIL],
        }),
        _status: "published",
        title: anotherPostTitle,
      }),
    );

    if (!anotherPost) {
      return;
    }

    await adminPostsApiClient.deleteById(anotherPost.id);

    const foundAnotherPost = await adminPostsApiClient.findById(anotherPost.id);
    expect(foundAnotherPost).toBeNull();
  });

  test("should find all versions (published and draft)", async ({
    adminPostsApiClient,
  }) => {
    if (!postOnePublished || !postTwoDraft) {
      return;
    }

    const findAllDocs = await adminPostsApiClient.findAllVersions({
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
    });

    expect(findAllDocs?.length).toBeGreaterThan(0);
  });

  test("should find version by id (published)", async ({
    adminPostsApiClient,
  }) => {
    if (!postOnePublished) {
      return;
    }

    const findAllDocs = await adminPostsApiClient.findAllVersions({
      parent: {
        equals: postOnePublished.id,
      },
      latest: {
        equals: true,
      },
    });
    expect(findAllDocs?.length).toEqual(1);

    if (!findAllDocs) {
      return;
    }

    const foundVersion = await adminPostsApiClient.findVersionById(
      findAllDocs[0].id,
    );

    expect(foundVersion?.parent).toEqual(postOnePublished.id);
  });

  test("should find version by id (draft)", async ({ adminPostsApiClient }) => {
    if (!postTwoDraft) {
      return;
    }

    const findAllDocs = await adminPostsApiClient.findAllVersions({
      parent: {
        equals: postTwoDraft.id,
      },
      latest: {
        equals: true,
      },
    });
    expect(findAllDocs?.length).toEqual(1);

    if (!findAllDocs) {
      return;
    }

    const foundVersion = await adminPostsApiClient.findVersionById(
      findAllDocs[0].id,
    );

    expect(foundVersion?.parent).toEqual(postTwoDraft.id);
  });

  test("should restore version by id (draft)", async ({
    adminPostsApiClient,
  }) => {
    if (!postTwoDraft) {
      return;
    }

    const findAllDocs = await adminPostsApiClient.findAllVersions({
      parent: {
        equals: postTwoDraft.id,
      },
      latest: {
        equals: true,
      },
    });
    expect(findAllDocs?.length).toEqual(1);

    if (!findAllDocs) {
      return;
    }

    await adminPostsApiClient.restoreVersionById(findAllDocs[0].id);
  });
});

// Workaround for WebStorm to run Playwright tests from the UI
// https://youtrack.jetbrains.com/issue/WEB-64686/Playwright-Tests-are-not-recognized-when-using-fixtures
// https://youtrack.jetbrains.com/issue/AQUA-711/Provide-a-run-configuration-for-Playwright-tests-in-specs-with-fixture-imports-only
base.describe("empty describe", () => {
  base("empty test", async () => {});
});
