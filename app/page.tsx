import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function Home() {
  const session = await auth()

  // If logged in, redirect to /app
  if (session) {
    redirect("/app")
  }

  // If not logged in, redirect to login
  redirect("/auth/login")
}
