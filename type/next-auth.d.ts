import { Employer, JobSeeker, User } from "@prisma/client";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Token {
    user: User;
  }

  interface JWT {
    user: User;
  }

  interface Session {
    profile: JobSeeker | Employer;
    user: User;
  }
}
