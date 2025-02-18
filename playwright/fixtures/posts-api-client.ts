import { APIRequestContext, expect } from "@playwright/test";
import { Post } from "@/payload-types";
import { Where } from "payload";
import { stringify } from "qs-esm";

export class PostsApiClient {
  readonly apiRequestContext: APIRequestContext;

  constructor(apiRequestContext: APIRequestContext) {
    this.apiRequestContext = apiRequestContext;
  }

  async findAll(whereQuery: Where): Promise<Post[]> {
    const findAllQueryAsString = stringify(
      {
        where: whereQuery,
      },
      { addQueryPrefix: true },
    );
    const findAllPostsResponse = await this.apiRequestContext.get(
      `/api/posts/${findAllQueryAsString}`,
    );
    expect(findAllPostsResponse.ok()).toBeTruthy();

    const findAllPostsResponseBody = await findAllPostsResponse.json();
    expect(findAllPostsResponseBody.docs).toBeTruthy();

    return findAllPostsResponseBody.docs;
  }

  async findById(id: number): Promise<Post | null> {
    const findByIdResponse = await this.apiRequestContext.get(
      `/api/posts/${id}`,
    );
    expect(String(findByIdResponse.status())).toMatch(/^200|404$/);

    if (findByIdResponse.ok()) {
      return await findByIdResponse.json();
    }
    return null;
  }

  async count(): Promise<{
    totalDocs: number;
  }> {
    const countPostsResponse =
      await this.apiRequestContext.get("/api/posts/count");
    expect(countPostsResponse.ok()).toBeTruthy();

    return await countPostsResponse.json();
  }

  async create(
    data: Omit<Post, "id" | "createdBy" | "updatedAt" | "createdAt">,
    expectedStatus?: string,
  ): Promise<Post | null> {
    const createPostResponse = await this.apiRequestContext.post("/api/posts", {
      data,
    });
    if (expectedStatus) {
      expect(String(createPostResponse.status())).toEqual(expectedStatus);
    }

    if (createPostResponse.ok()) {
      const createPostResponseBody = await createPostResponse.json();
      expect(createPostResponseBody.doc).toBeTruthy();

      return createPostResponseBody.doc;
    }
    return null;
  }

  async updateAll(
    whereQuery: Where,
    data: Omit<Post, "id" | "createdBy" | "updatedAt" | "createdAt">,
    expectedStatus?: string,
  ): Promise<Post[] | null> {
    const updateQueryAsString = stringify(
      {
        where: whereQuery,
      },
      { addQueryPrefix: true },
    );
    const updateAllResponse = await this.apiRequestContext.patch(
      `/api/posts/${updateQueryAsString}`,
      {
        data,
      },
    );
    if (expectedStatus) {
      expect(String(updateAllResponse.status())).toEqual(expectedStatus);
    }

    if (updateAllResponse.ok()) {
      const updateAllResponseBody = await updateAllResponse.json();
      expect(updateAllResponseBody.docs).toBeTruthy();

      return updateAllResponseBody.docs;
    }
    return null;
  }

  async updateById(
    id: number,
    data: Omit<Post, "id" | "createdBy" | "updatedAt" | "createdAt">,
    expectedStatus?: string,
  ): Promise<Post | null> {
    const updateByIdResponse = await this.apiRequestContext.patch(
      `/api/posts/${id}`,
      {
        data,
      },
    );
    if (expectedStatus) {
      expect(String(updateByIdResponse.status())).toEqual(expectedStatus);
    }

    if (updateByIdResponse.ok()) {
      const updateByIdResponseBody = await updateByIdResponse.json();
      expect(updateByIdResponseBody.doc).toBeTruthy();

      return updateByIdResponseBody.doc;
    }
    return null;
  }

  async deleteAll(
    whereQuery: Where,
    expectedStatus?: string,
  ): Promise<Post[] | null> {
    const deleteAllQueryAsString = stringify(
      {
        where: whereQuery,
      },
      { addQueryPrefix: true },
    );
    const deleteAllResponse = await this.apiRequestContext.delete(
      `/api/posts/${deleteAllQueryAsString}`,
    );
    if (expectedStatus) {
      expect(String(deleteAllResponse.status())).toEqual(expectedStatus);
    }

    if (deleteAllResponse.ok()) {
      const updateByIdResponseBody = await deleteAllResponse.json();

      return updateByIdResponseBody.docs || null;
    }
    return null;
  }

  async deleteById(id: number, expectedStatus?: string): Promise<void> {
    const deletePostOneResponse = await this.apiRequestContext.delete(
      `/api/posts/${id}`,
    );
    if (expectedStatus) {
      expect(String(deletePostOneResponse.status())).toEqual(expectedStatus);
    } else {
      expect(String(deletePostOneResponse.status())).toMatch(/^200|404$/);
      // expect([200, 404]).toContainEqual(deletePostOneResponse.status());
    }
  }

  async findAllVersions(
    whereQuery: Where,
    expectedStatus?: string,
  ): Promise<
    | {
        id: number;
        parent: number;
        version: Post;
        latest: boolean;
        autosave: boolean;
      }[]
    | null
  > {
    const findAllVersionsQueryAsString = stringify(
      {
        where: whereQuery,
      },
      { addQueryPrefix: true },
    );
    const findAllVersionsResponse = await this.apiRequestContext.get(
      `/api/posts/versions/${findAllVersionsQueryAsString}`,
    );
    if (expectedStatus) {
      expect(String(findAllVersionsResponse.status())).toEqual(expectedStatus);
    }

    if (findAllVersionsResponse.ok()) {
      const findAllPostsResponseBody = await findAllVersionsResponse.json();
      expect(findAllPostsResponseBody.docs).toBeTruthy();

      return findAllPostsResponseBody.docs;
    }
    return null;
  }

  async findVersionById(
    id: number,
    expectedStatus?: string,
  ): Promise<{
    id: number;
    parent: number;
    version: Post;
    latest: boolean;
    autosave: boolean;
  } | null> {
    const findByIdResponse = await this.apiRequestContext.get(
      `/api/posts/versions/${id}`,
    );
    if (expectedStatus) {
      expect(String(findByIdResponse.status())).toEqual(expectedStatus);
    } else {
      expect(String(findByIdResponse.status())).toMatch(/^200|404$/);
      if (findByIdResponse.ok()) {
        return await findByIdResponse.json();
      }
    }
    return null;
  }

  async restoreVersionById(id: number, expectedStatus?: string): Promise<void> {
    const restoreVersionByIdResponse = await this.apiRequestContext.post(
      `/api/posts/versions/${id}`,
    );
    if (expectedStatus) {
      expect(String(restoreVersionByIdResponse.status())).toEqual(
        expectedStatus,
      );
    } else {
      expect(restoreVersionByIdResponse.ok()).toBeTruthy();
    }
  }
}
