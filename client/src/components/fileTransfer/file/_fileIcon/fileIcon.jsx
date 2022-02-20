import React from 'react'

import { IoMusicalNotes, IoDocument, IoImage, IoFilm, IoReader, IoSend, IoClose, IoDownload } from 'react-icons/io5';

import classes from './fileIcon.module.scss';

const fileTypeToIcon = ( fileType ) => {
  switch ( fileType ) {
    case 'audio': {
      return <IoMusicalNotes style={{ color: 'hsl(115, 91%, 75%)' }} /> 
    }
    case 'image': { 
      return <IoImage style={{ color: 'hsl(224, 91%, 75%)' }} /> 
    }
    case 'video': {
      return <IoFilm style={{ color: 'hsl(0, 91%, 75%)' }} /> 
    }
    default: {
      return <IoReader style={{ color: 'hsl(313, 91%, 75%)' }} /> 
    }
  }
}

function FileIcon({ fileType }) {
  return (
    <div className={ classes.icon }>
      { fileTypeToIcon(fileType.split('/')[0]) }
    </div>
  )
}

export default FileIcon