import { withAuth } from "next-auth/middleware"
import { signIn } from "next-auth/react"

// middleware is applied to all routes, use conditionals to select

export default withAuth(
  function middleware (req) {
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        if (
          !req.nextUrl.pathname.startsWith('/api') &&
          req.nextUrl.pathname !== '/' &&
          token === null
        ) {
          return false
        }
        return true
      }
    },
  }
)