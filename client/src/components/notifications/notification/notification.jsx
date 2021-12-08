import React from 'react'
import { motion, AnimatePresence } from 'framer-motion';

import classes from './notification.module.scss';

const variants = {
  visible: {
    y: '2rem',
    opacity: 1
  },
  hidden: {
    y: '-2rem',
    opacity: 0
  }
}

function Notification({ isVisible, children }) {
  return (
    <div className={ classes.notificationWrapper }>
      <AnimatePresence exitBeforeEnter>
        {
          isVisible ? 
          <motion.div
            variants={ variants }
            animate="visible"
            exit="hidden"
            initial="hidden"
            className={ classes.notification }
          >
            { children }
          </motion.div> : null
        }
      </AnimatePresence>
    </div>
  )
}

export default Notification
