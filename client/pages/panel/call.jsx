import Head from 'next/head';
import { useRouter } from 'next/router';

import { motion } from 'framer-motion';
import CallManager from '../../src/components/callDisplays/callManager/callManager';


function CallDisplay() {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>calling { router.query.callTo } - Secure Call</title>
      </Head>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {
          typeof router.query.callTo !== 'undefined' && typeof router.query.callType !== 'undefined' && typeof router.query.callType !== undefined ?
          <CallManager callTo={ router.query.callTo } calling={ router.query.calling } callType={ router.query.callType } /> : null
        }
      </motion.div>
    </>
  )
}

export default CallDisplay
