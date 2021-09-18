import { Message } from "@material-ui/icons";
import Cookies from "js-cookie";
import NextAuth from "next-auth";
import Providers from "next-auth/providers";

export default NextAuth({
  session: {
    jwt: true,
  },
  providers: [
    Providers.Credentials({
      async authorize(credentials) {
            const res = await fetch("https://pelglobal.iran.liara.run/api/login", {
              method: "POST",
              body: JSON.stringify(credentials),
              headers: { "Content-Type": "application/json" },
            });
            const user = await res.json();
    
            // If no error and we have user data, return it
            if (user.status === 'Success') {         
              return user;
            }
            // Return null if user data could not be retrieved
            return  Promise.reject('/auth/signin?errorMessage=tryAgain');
      
      },
    }),
  ],
  jwt: {
    signingKey: process.env.JWT_SIGNING_PRIVATE_KEY
  },
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: '/auth/signin', // Error code passed in query string as ?error=
    // verifyRequest: '/auth/verify-request', // (used for check email message)
    // newUser: '/auth/new-user' // New users will be directed here on first sign in (leave the property out if not of interest)
  },
   callbacks : {
    // Getting the JWT token from API response
    async jwt(token, user) {
      if (user) {
          token.accessToken = user.token
      }
      return token
    },
  
    async session(session, token) {
      session.accessToken = token.accessToken
      return session
    }
  }
});
