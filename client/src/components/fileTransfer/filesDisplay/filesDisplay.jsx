import { motion, AnimatePresence } from 'framer-motion'

import UploadFile from '../file/uploadFile/uploadFile'
import classes from './filesDisplay.module.scss';

const variants = {
  visible: {
    y: 0,
    x: 0,
    opacity: 1
  },
  hidden: {
    y: `-1rem`,
    opacity: 0
  },
  exit: {
    x: `-1rem`,
    opacity: 0
  },
}

const MotionFile = ({ id, removeFile, send, file }) => {
  return (
    <motion.div layout variants={ variants } initial='hidden' animate='visible' exit='exit'>
      <UploadFile removeFile={ removeFile } send={ send } file={ file }/>
    </motion.div>
  )
}

function FilesDisplay({ files, removeFile, sendFile }) {
  return (
    <div className={ classes.filesDisplay }>
      <AnimatePresence style={{ maxWidth: '100%', overflowX: 'hidden' }} layout>
        {
          files.map((file) => <MotionFile 
            key={ file.id } 
            id={ file.id } 
            send={ _ => sendFile(file.id) } 
            removeFile={ _ => removeFile(file.id) } 
            data={ file.file }
            file={ file }
          /> 
          )
        }
      </AnimatePresence>
    </div>
  )
}

export default FilesDisplay