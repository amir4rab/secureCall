import FileControls from '../_fileControls/fileControls';
import FileDetails from '../_fileDetails/fileDetails';
import FileProgress from '../_fileProgress/fileProgress';

import classes from './uploadFile.module.scss';

function File({ removeFile, send, file }) {
  return (
    <div className={ classes.file }>
      <div className={ classes.fileInfo }>
        <FileDetails name={ file.file.name } size={ file.file.size } type={ file.file.type } />
      </div>
      <div className={ classes.progressState }>
        <FileProgress state={ file.state } currentPercentage={ file.percentage }/>
      </div>
      <div className={ classes.actions }>
        <FileControls state={ file.state } sendFn={ send } removeFn={ removeFile } cancelFn={ _ => console.log('cancel') } />
      </div>
    </div>
  )
}

export default File