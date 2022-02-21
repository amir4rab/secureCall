import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import classes from './displayFileTransferOverView.module.scss';

import { IoCloudDownload, IoCloudUpload, IoFileTray } from 'react-icons/io5'

import OverviewFile from '../file/overviewFile/overviewFile';
import { readableSize } from '../../../utils/frontend/fileManager/fileManager';

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

const MotionFile = ({ data }) => {
  return (
    <motion.div layout variants={ variants } initial='hidden' animate='visible' exit='exit'>
      <OverviewFile data={ data }/>
    </motion.div>
  );
}

const EmptyFileOverView = ({ toDownload, toUpload }) => {
  return (
    <motion.div className={ classes.emptyFileOverView }>
      <div className={ classes.prompt }>
        <div className={ classes.iconWrapper }><IoFileTray /></div>
        <p>Start sending and receiving files</p>
      </div>
      <div className={ classes.actions }>
        <button onClick={ toUpload } className={ classes.actionButton }>
          <IoCloudUpload />
          <p>Upload</p>
        </button>
        <button onClick={ toDownload } className={ classes.actionButton }>
          <IoCloudDownload />
          <p>Download</p>
        </button>
      </div>
    </motion.div>
  )
}

const totalSize = ( dataArr ) => {
  const totalSend = 0;
  const totalReceive = 0;
  dataArr.forEach( item => {
    if ( item.operation === 'send' ) totalSend = totalSend + +item.size
    if ( item.operation === 'receive' ) totalReceive = totalReceive + +item.size
  });

  return {
    totalSend: readableSize(totalSend),
    totalReceive: readableSize(totalReceive)
  };
}

function DisplayFileTransferOverView({ hidden, dataArr, toDownload, toUpload }) {
  const [ totalSend, setTotalSend ] = useState(0);
  const [ totalReceive, setTotalReceive ] = useState(0);

  useEffect( _ => {
    const { totalSend, totalReceive } = totalSize(dataArr);
    setTotalSend(totalSend);
    setTotalReceive(totalReceive);
  }, [dataArr])

  return (
    <div className={[ classes.overView, hidden ? classes.hidden : null ].join(' ')}>
      <h1 className={ classes.title }>
        Transfer overview
      </h1>
      <div className={ classes.info }>
        <div className={ classes.infoBox }>
          <div className={ classes.subtitle }>
            <IoCloudUpload />
            <h3>Upload</h3>
          </div>
          <div className={ classes.content }>
            { totalSend }
          </div>
        </div>
        <div className={ classes.infoBox }>
          <div className={ classes.subtitle }>
            <IoCloudDownload />
            <h3>Download</h3>
          </div>
          <div className={ classes.content }>
            { totalReceive }
          </div>
        </div>
      </div>
      <div className={ classes.summery }>
        <h3 className={ classes.subtitle }>Summery</h3>
        <div className={ classes.summeryFiles }>
          <AnimatePresence exitBeforeEnter>
            {
              dataArr.length === 0 ?
              <EmptyFileOverView toDownload={ toDownload } toUpload={ toUpload }/> : 
              <AnimatePresence>
                {
                  dataArr.map(item => <MotionFile key={ item.id } data={ item } />)
                }
              </AnimatePresence>
            }
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export default DisplayFileTransferOverView