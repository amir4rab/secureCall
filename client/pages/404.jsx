import Head from 'next/head';
import { motion } from 'framer-motion';
import NotFoundComponent from '../src/components/error/404';

function NotFound() {
  return (
    <>
      <Head>
        <title>404 - not found</title>
      </Head>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <NotFoundComponent />
      </motion.div>
    </>
  );
}

export default NotFound;
