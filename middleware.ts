// import { withAuth } from "next-auth/middleware"
// import { NextResponse } from "next/server"

// export default withAuth(
//   function middleware(req) {
//     // Custom middleware logic (if needed)
//     return NextResponse.next()
//   },
//   {
//     callbacks: {
//       authorized: ({ token, req }) => {
//         const isAdminRoute = req.nextUrl.pathname.startsWith('/admin/')
//         const isHomePage = req.nextUrl.pathname === '/'
//         const isAdmin = token?.user?.role === 'Admin'

//         if (isAdminRoute && !isAdmin) {
//           return false
//           NextResponse.redirect('/')
//         }

//         return !!token
//       }
//     },
//     pages: {
//       signIn: '/login',
//     }
//   }
// )

// // Optionally, configure which routes require authentication
// export const config = {
//   matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
// }

// import { withAuth } from "next-auth/middleware"
// import { signIn } from "next-auth/react"

// // middleware is applied to all routes, use conditionals to select

// export default withAuth(
//   function middleware (req) {
//   },
//   {
//     callbacks: {
//       authorized: ({ req, token }) => {
//         if (
//           !req.nextUrl.pathname.startsWith('/api') &&
//           req.nextUrl.pathname !== '/' &&
//           token === null
//         ) {
//           return false
//         }
//         return true
//       }
//     },
//   }
// )