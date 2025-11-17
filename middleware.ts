import { auth } from "@/auth"

export default auth((req) => {
  const { pathname } = req.nextUrl
  const isLoggedIn = !!req.auth

  // Public routes that don't require authentication
  const publicRoutes = [
    '/api/auth',
    '/api/products',
    '/auth/login',
    '/auth/signup',
    '/auth/reset-password'
  ]

  // Check if the route is public
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))

  // Protected routes that require authentication
  const isProtectedRoute = pathname.startsWith('/app')
  const isAdminRoute = pathname.startsWith('/admin')

  // If user is not logged in and trying to access protected route
  if (!isLoggedIn && (isProtectedRoute || isAdminRoute)) {
    const url = new URL('/auth/login', req.url)
    return Response.redirect(url)
  }

  // Check if trying to access admin routes
  if (isAdminRoute && isLoggedIn) {
    const user = req.auth?.user
    // Only allow super admin to access admin routes
    if (user?.email !== 'admin@example.com' && user?.role !== 'super_admin') {
      const url = new URL('/app', req.url)
      return Response.redirect(url)
    }
  }

  // Allow access to all other routes
  return
})

// Configure which routes the middleware runs on
export const config = {
  matcher: [
    // Match all API routes
    '/api/:path*',
    // Match all pages except static files
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ]
}
