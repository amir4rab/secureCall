import NextAuth from 'next-auth'
import GithubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'
import TwitterProvider from "next-auth/providers/twitter";
import NetlifyProvider from "next-auth/providers/netlify";
// import { MongoDBAdapter } from "@next-auth/mongodb-adapter"

import generateUser from '../../../src/utils/backend/generateUser/generateUser';
// import clientPromise from '../../../src/utils/lib/mongodb';
// import getUserJWT from '../../../src/utils/backend/getUserJWT/getUserJWT';


export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      authorizationUrl: process.env.AUTHORIZATION_URL
    }),
    // TwitterProvider({
    //   clientId: process.env.TWITTER_CLIENT_ID,
    //   clientSecret: process.env.TWITTER_CLIENT_SECRET
    // })
  ],
  // adapter: MongoDBAdapter(clientPromise),
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      // ** Generating users account and adding them to database **//
      const response = await generateUser(user, account);

      if ( response.status === 'successful' ) {
        return true;
      } else {
        switch( response.reason ) {
          case 'falseProvider': {
            return '/false-provider'
          }
        }
      }
    }
  },
  secret: process.env.NEXTAUTH_SECRET
})