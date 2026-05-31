import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import path from "path";
import { buildConfig } from "payload";
import { fileURLToPath } from "url";
import sharp from "sharp";

import { Media } from "@/collections/Media";
import { Posts } from "@/collections/Posts";
import { Users } from "@/collections/Users";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
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
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Posts],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || "",
    },
    push: process.env.NODE_ENV === "development",
    migrationDir: "./src/migrations",
    idType: "serial",
  }),
  sharp,
  plugins: [],
});
