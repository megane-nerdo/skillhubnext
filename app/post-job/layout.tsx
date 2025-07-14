import { notFound, redirect } from "next/navigation";
import { authOptions } from "../lib/auth";
import { getServerSession } from "next-auth";
export default async function PostJobLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "EMPLOYER") {
    return redirect("/auth/login");
  }
  return <div>{children}</div>;
}
