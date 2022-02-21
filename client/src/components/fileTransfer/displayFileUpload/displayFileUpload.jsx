import { v4 } from 'uuid';
import FilePicker from '../filePicker/filePicker';
import FilesDisplay from '../filesDisplay/filesDisplay';

import classes from './displayFileUpload.module.scss';

function DisplayFileUpload({ hidden, addItem, removeItem, sendFile, dataArr }) {
  const appendItem = ( file ) => {
    addItem({
      id: v4(),
      percentage: 0,
      state: 'waiting', // other states: sended, sending, requested
      file: file
    })
  }

  return (
    <div className={[ classes.fileUpload, hidden ? classes.hidden : null ].join(' ')}>
      <h1 className={ classes.title }>
        Upload Files
      </h1>
      <FilePicker isBusy={ false } emitFile={ appendItem } />
      <FilesDisplay removeFile={ removeItem } files={ dataArr } sendFile={ sendFile } />
    </div>
  )
}

export default DisplayFileUpload