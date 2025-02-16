import { sqliteAdapter } from "@payloadcms/db-sqlite";
// import { postgresAdapter } from "@payloadcms/db-postgres";
import { payloadCloudPlugin } from "@payloadcms/payload-cloud";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import path from "path";
import { buildConfig } from "payload";
import { fileURLToPath } from "url";
import sharp from "sharp";

import { Users } from "@/collections/Users";
import { Media } from "@/collections/Media";
import { Posts } from "@/collections/Posts";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    components: {
      logout: {
        Button: {
          path: "@/components/payload/elements/log-out-button#LogOutButton",
        },
      },
      beforeDashboard: [
        "@/components/payload/elements/before-dashboard/welcome-panel#WelcomePanel",
      ],
      afterNavLinks: [
        "@/components/payload/elements/after-nav-links/clerk-users-link#ClerkUsersLink",
      ],
      views: {
        clerkUsersView: {
          Component:
            "@/components/payload/views/clerk-users/clerk-users#ClerkUsers",
          path: "/clerk-users",
        },
      },
      providers: ["@/providers/auth-provider#AuthProvider"],
    },
  },
  collections: [Users, Media, Posts],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  // SQLite
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URI || "",
    },
  }),
  // PostgreSQL
  // db: postgresAdapter({
  //   pool: {
  //     connectionString: process.env.DATABASE_URI || "",
  //   },
  // }),
  sharp,
  plugins: [
    payloadCloudPlugin(),
    // storage-adapter-placeholder
  ],
});
