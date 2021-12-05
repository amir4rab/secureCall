import NextAuth from 'next-auth'
import GithubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'

import generateUser from '../../../src/utils/backend/generateUser/generateUser';
import getUserJWT from '../../../src/utils/backend/getUserJWT/getUserJWT';


export default NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      authorizationUrl: process.env.AUTHORIZATION_URL
    })
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      //** Generating users account and adding them to database **//
      await generateUser(user);

      return true
    },
    async session({ session, user, token }) {

      
      session.user.jwt = await getUserJWT(session.user.email);
      return session    
    }
  }
})