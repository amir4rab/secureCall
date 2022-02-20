import FileControls from '../_fileControls/fileControls';
import FileProgress from '../_fileProgress/fileProgress';
import FileDetails from '../_fileDetails/fileDetails';

import classes from './downloadFile.module.scss';

function File({ data, remove, accept, save }) {
  return (
    <div className={ classes.file }>
      <div className={ classes.fileInfo }>
        <FileDetails name={ data.name } size={ data.size } type={ data.type } />
      </div>
      <div className={ classes.progressState }>
        <FileProgress state={ data.state } receive currentPercentage={ data.percentage }/>
      </div>
      <div className={ classes.actions }>
        <FileControls receiving={ true } state={ data.state } sendFn={ accept } removeFn={ remove } saveFn={ save } cancelFn={ _ => console.log('cancel!') } />
      </div>
    </div>
  )
}

export default File