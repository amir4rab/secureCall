import { motion } from 'framer-motion';
import Panel from '../src/components/panel/panel'

function PanelPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Panel />
    </motion.div>
  )
}

export default PanelPage
