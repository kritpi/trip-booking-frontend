
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || session.user.role !== "Admin") {
    redirect("/?callbackUrl=/admin");
  }

  return (
    <div>
      {" "}
      <h1>Admin Dashboard</h1>{" "}
      <p>Welcome, {session.user.name}! You have admin access.</p>{" "}
    </div>
  );
}
