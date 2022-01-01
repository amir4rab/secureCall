import Head from 'next/head';
import { motion } from 'framer-motion';

import styles from '../styles/Home.module.scss';

import Hero from '../src/components/hero/hero';

export default function HomePage() {
  return (
    <>
      <Head>
        <title>Secure Call</title>
      </Head>
      <motion.div 
        className={styles.container}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <Hero />
      </motion.div>
    </>
  )
}
