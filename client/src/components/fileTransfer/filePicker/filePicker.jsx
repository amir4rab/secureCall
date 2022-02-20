import { useState, useRef, useEffect } from 'react'

import { IoFileTray } from 'react-icons/io5'
import { readableSize } from '../../../utils/frontend/uploadManager/uploadManager';

import classes from './filePicker.module.scss';

const verifyFile = ( file, maxSize ) => {
  if ( file.size === 0 ) {
    return false;
  }
  if ( file.size > maxSize ) {
    return false
  }
  return true;
  // console.log()
}

function FilePicker({ emitFile= null, maxSize= 250000000, isBusy= false }) {
  const [ isActive, setIsActive ] = useState(false);

  const [ error, setError ] = useState(null);
  const [ errorDisplay, setErrorDisplay ] = useState(false);
  const errorCleanerRef = useRef();

  const fileInputRef = useRef();

  const onFileHandler = ( file ) => {
    if ( !verifyFile( file, maxSize ) ) {
      setError('File is larger than max allowed size!')
      setErrorDisplay(true);
      return;
    }
    if ( isBusy ) return;
    emitFile && emitFile(file)
  }

  useEffect(_ => {
    if( errorDisplay ) errorCleanerRef.current = setTimeout(() => {
      setErrorDisplay(false);
    }, 3000 );
  }, [ errorDisplay ]);

  useEffect(_ => {
    return () => clearTimeout(errorCleanerRef.current);
  }, [])

  const onFileInputChange = (e) => {
    if ( e.target.files.length ) onFileHandler(e.target.files[0])
  }

  const onDragLeave = () => {
    setIsActive(false);
  }
  const onDragStart = () => {
    setIsActive(true);
  }
  const onDrop = (e) => {
    e.preventDefault()
    if ( e.dataTransfer.files.length ) onFileHandler(e.dataTransfer.files[0]);
    setIsActive(false);
  }
  const onDragOver = (e) => {
    e.preventDefault()
    setIsActive(true);
  }
  const inputEventHandler = () => {
    fileInputRef.current.click();
  }

  return (
    <div className={ classes.filePicker }>
      <div 
        onDragStart={ onDragStart } onDragLeave={ onDragLeave } onDrop={ onDrop } onDragOver={ onDragOver } 
        className={[ classes.inner, isActive ? classes.active : null, isBusy ? classes.busy : null ].join(' ')}
      >
        <div className={[ classes.error, errorDisplay ? classes.display : null ].join(' ')}>{ error }</div> 
        <input onChange={ onFileInputChange } ref={ fileInputRef } type="file" style={{ display: 'none' }} />
        <div className={ classes.prompt }>
          <div className={ classes.icon }>
            <IoFileTray />
          </div>
          <div className={[ classes.promptGroup, classes.dragTitle ].join(' ')}>
            <p>Drag and Drop your file</p>
          </div>
          <div className={ classes.divider }>Or</div>
          <div className={ classes.promptGroup }>
            <button onClick={ inputEventHandler } className={ classes.buttonPrimary }>Select a file</button>
          </div>
        </div>
        <p className={ classes.info }>Max file size is {readableSize(maxSize)}</p>
      </div>
    </div>
  )
}

export default FilePicker