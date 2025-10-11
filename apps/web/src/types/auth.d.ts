import "better-auth";

declare module "better-auth" {
  interface User {
    profileImage?: string | null;
    bio?: string | null;
    location?: string | null;
  }
}
