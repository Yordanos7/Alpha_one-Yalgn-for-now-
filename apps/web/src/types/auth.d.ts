import "better-auth";

declare module "better-auth" {
  interface User {
    profileImage?: string | null;
    // Add your own properties here, for example:
    // role: "user" | "admin";
  }
}
