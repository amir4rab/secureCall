import Head from 'next/head';
import { motion } from 'framer-motion';
import Settings from '../../src/components/settings/settings';

function SettingsPage() {
  return (
    <>
      <Head>
        <title>Settings - Secure Call</title>
      </Head>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <Settings />
      </motion.div>
    </>
  )
}

export default SettingsPage
