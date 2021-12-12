import Head from 'next/head';
import { motion } from 'framer-motion';

import Auth from '../src/components/auth/auth';

function AuthPage() {
  return (
    <>
      <Head>
        <title>Secure Call - Authentication</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <Auth />
      </motion.div>
    </>
  )
}

export default AuthPage;