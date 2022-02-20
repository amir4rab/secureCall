import React from 'react'
import { AnimatePresence, motion } from 'framer-motion'

import classes from './fileProgress.module.scss';

function FileProgress({ state, currentPercentage, receive = false }) {

  if ( receive ) return ( // File progress for file's which are downloading
    <div className={ classes.wrapper }>
      <AnimatePresence style={{ width: '100%', backgroundColor: 'red' }}>
        {
          state === 'waiting' ? <motion.div> Waiting for you </motion.div> : null
        }
        {
          state === 'requested' ? <motion.div> Waiting for File </motion.div>: null
        }
        {
          state === 'receiving' | state === 'received'  ? 
          <motion.div>
            <div className={ classes.progress }>
              <p>{ currentPercentage }%</p>
              <div style={{ left: `${currentPercentage - 100}%` }} className={ classes.bg } />
            </div>
          </motion.div> : null
        }
      </AnimatePresence>
    </div>
  )

  return ( // File progress for file's which are uploading
    <div className={ classes.wrapper }>
      <AnimatePresence>
        {
          state === 'waiting' ? <motion.div> Waiting for send </motion.div> : null
        }
        {
          state === 'requested' ? <motion.div>Waiting for peer to accept the file</motion.div>: null
        }
        {
          state === 'sending' | state === 'sended'  ? 
          <motion.div>
            <div className={ classes.progress }>
              <p>{ currentPercentage }%</p>
              <div style={{ left: `${currentPercentage - 100}%` }} className={ classes.bg } />
            </div>
          </motion.div> : null
        }
      </AnimatePresence>
    </div>
  )
}

export default FileProgress