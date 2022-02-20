import React from 'react'

import FileIcon from '../_fileIcon/fileIcon';
import shortenName from '../_utils/shortenFileName';
import { readableSize } from '../../../../utils/frontend/uploadManager/uploadManager'

import classes from './fileDetails.module.scss';

function FileDetails({ name, size, type }) {
  return (
    <div className={ classes.fileDetails }>
      <FileIcon fileType={ type } />
      <div>
        <p className={ classes.name }>{ shortenName(name) }</p>
        <p className={ classes.size }>{ readableSize(size) }</p>
      </div>
    </div>
  )
}

export default FileDetails