import Head from 'next/head';
import { motion } from 'framer-motion';
import ServerErrorComponent from '../src/components/error/500';

function NotFound() {
  return (
    <>
      <Head>
        <title>500 - Server Error</title>
      </Head>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <ServerErrorComponent />
      </motion.div>
    </>
  );
}

export default NotFound;
