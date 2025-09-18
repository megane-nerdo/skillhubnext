import { getServerSession } from "next-auth";
import { authOptions } from "../lib/auth";
import { PostJobClient } from "./postJobClient";
import { redirect } from "next/navigation";
import { CheckSubscription } from "../lib/checkSubscription";
export default async function PostJob() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "EMPLOYER") {
    return redirect("/auth/login");
  }
  const userId = session?.user.id;
  const subscription = await CheckSubscription(userId);
  return <PostJobClient userId={userId} subscription={subscription} />;
}
