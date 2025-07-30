import { getUser } from "@/app/actions/auth";
import { HomeClient } from "@/components/home-client";
import { redirect } from "next/navigation";

export default async function Home() {
  const userResult = await getUser();

  if (userResult.success && userResult.data) {
    redirect("/chat");
  }

  return <HomeClient />;
}
