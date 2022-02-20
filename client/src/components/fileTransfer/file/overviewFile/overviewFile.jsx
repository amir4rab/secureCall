import { IoCloudUpload, IoCloudDownload } from 'react-icons/io5';

import FileDetails from '../_fileDetails/fileDetails';


import classes from './overviewFile.module.scss';

function OverviewFile({ data }) {
  return (
    <div className={ classes.file }>
      <div className={ classes.fileInfo }>
        <FileDetails name={ data.name } size={ data.size } type={ data.type } />
      </div>
      <div className={ classes.fileTransferState }>
        <div className={[ classes.fileTransferState, data.operation === 'send' ? classes.send : classes.receive ].join(' ')}>
          <p>{ data.operation === 'send' ? 'Sended' : 'Received' }</p>
          <div className={ classes.svgWrapper }>
            { data.operation === 'send' ? <IoCloudUpload/> : <IoCloudDownload/> }
          </div>
        </div>
      </div>
    </div>
  );
}

export default OverviewFile