import { motion, AnimatePresence } from 'framer-motion'

import DownloadFile from '../file/downloadFile/downloadFile';

import classes from './displayFileDownload.module.scss';

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

const MotionFile = ({ data, save, remove, accept }) => {
  return (
    <motion.div layout variants={ variants } initial='hidden' animate='visible' exit='exit'>
      <DownloadFile data={ data } save={ save } remove={ remove } accept={ accept }/>
    </motion.div>
  )
}


function DisplayFileDownload({ hidden, dataArr, removeItem, acceptFile, downloadFile }) {
  return (
    <div className={[ classes.fileUpload, hidden ? classes.hidden : null ].join(' ')}>
      <h3 className={ classes.title }>Download Files</h3>
      <div className={ classes.files }>
        <AnimatePresence>
          {
            dataArr.map(item => <MotionFile key={ item.id } data={ item } save={ _ => downloadFile(item.id) } remove={ _ => removeItem(item.id) } accept={ _ => acceptFile(item.id) } />)
          }
        </AnimatePresence>
      </div>
    </div>
  )
}

export default DisplayFileDownload