import React from 'react'
import Incognito from '../../src/components/incognito/incognito';
import Head from 'next/head';
import { motion } from 'framer-motion';


function IncognitoPage() {
  return (
    <>
      <Head>
        <title>Secure call</title>
      </Head>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <Incognito />
      </motion.div>
    </>
  )
}

export default IncognitoPage
