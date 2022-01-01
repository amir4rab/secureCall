import Head from 'next/head';
import { motion } from 'framer-motion';
import About from '../src/components/about/about';

function AboutPage() {
  return (
    <>
      <Head>
        <title>About - Secure Call</title>
      </Head>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <About />
      </motion.div>
    </>
  )
}

export default AboutPage
