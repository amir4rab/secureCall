import { useEffect, useRef ,useState } from 'react'

import { IoCloudDownload, IoCloudUpload, IoSwapVertical, IoCloudOffline } from 'react-icons/io5'

import classes from './fileSidebar.module.scss'; 

function FileSidebar({ activePosition, setActivePosition, endSession, notification, clearNotification }) {
  const [ uploadNotification, setUploadNotification ] = useState(false);
  const uploadNotificationRef = useRef(null);

  const [ downloadNotification, setDownloadNotification ] = useState(false);
  const downloadNotificationRef = useRef(null);

  useEffect( _ => {
    if ( notification === null ) return;

    switch(notification) {
      case 'uploadEvent': {
        setUploadNotification(true);
        uploadNotificationRef.current && clearTimeout(uploadNotificationRef.current);

        uploadNotificationRef.current = setTimeout( _ => {
          uploadNotificationRef.current = null
          setUploadNotification(false)
        }, 300 )

        break;
      }
      case 'downloadEvent': {
        setDownloadNotification(true);
        downloadNotificationRef.current && clearTimeout(downloadNotificationRef.current);

        downloadNotificationRef.current = setTimeout( _ => {
          downloadNotificationRef.current = null
          setDownloadNotification(false)
        }, 300 )

        break;
      }
    }

    clearNotification();
  }, [ notification, clearNotification ]);

  return (
    <div className={ classes.fileSidebar }>
      <nav className={ classes.inner }>
        <div className={ classes.topContent }>
          <button 
            className={[ classes.icon, activePosition === 'overview' ? classes.active : null ].join(' ')}
            onClick={ _ => setActivePosition('overview') }
          >
            <IoSwapVertical />
          </button>
          <button 
            className={[ classes.icon, activePosition === 'upload' ? classes.active : null, uploadNotification ? classes.shake : null ].join(' ')}
            onClick={ _ => setActivePosition('upload') }
          >
            <IoCloudUpload />
          </button>
          <button 
            className={[ classes.icon, activePosition === 'download' ? classes.active : null, downloadNotification ? classes.shake : null ].join(' ')}
            onClick={ _ => setActivePosition('download') }
          >
            <IoCloudDownload />
          </button>
        </div>
        <div className={ classes.bottomContent }>
          <button onClick={ endSession } className={ classes.exitButton }>
            <IoCloudOffline />
          </button>
        </div>
      </nav>
    </div>
  )
}

export default FileSidebar