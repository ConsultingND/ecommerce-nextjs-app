import { auth, signOut } from "@/auth"
import { redirect } from "next/navigation"

export default async function AppPage() {
  const session = await auth()

  if (!session) {
    redirect("/auth/login")
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 text-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            This page can only be seen by logged-in users.
          </h1>
          {session.user?.email && (
            <p className="mt-4 text-gray-600">
              Logged in as: {session.user.email}
            </p>
          )}
        </div>
        <form
          action={async () => {
            "use server"
            await signOut({ redirectTo: "/auth/login" })
          }}
        >
          <button
            type="submit"
            className="inline-flex justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
          >
            Sign out
          </button>
        </form>
      </div>
    </div>
  )
}

