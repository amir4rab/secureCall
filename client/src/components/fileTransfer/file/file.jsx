import { useState, useRef, useEffect } from 'react'

import { IoMusicalNotes, IoDocument, IoImage, IoFilm, IoReader, IoSend, IoClose, IoDownload } from 'react-icons/io5';
import FileIcon from './_fileIcon/fileIcon';

import { readableSize } from '../../../utils/frontend/uploadManager/uploadManager'

import classes from './file.module.scss';
import FileProgress from './_fileProgress/fileProgress';

const shortenName = (name) => {
  if(name.length < 20) return name;
  return `${name.slice(0, 8)}...${name.slice(name.length - 8, name.length)}`;
}

function File({ data, removeFile, sendInfo, summeryFile= false }) {
  const [ status ,setStatus ] = useState('waiting');
  const [ fileData, setFileData ] = useState([ 't', 't', 't', 't' ]);
  const [ currentPercentage, setCurrentPercentage ] = useState(0);
  const testIntervalRef= useRef();

  const loadFile = () => {
    setStatus('requested')
  }

  const sendFile = () => {
    setStatus('sending');
  }

  const progressMeter = ( currentChunk ) => {
    setCurrentPercentage(+( currentChunk * 100 / fileData.length ).toFixed(0));
    console.log(currentPercentage)
  }

  useEffect( _ => {
    
  }, []);

  // const testWorkFlow = () => {
  //   loadFile();
  //   setTimeout(_ => { 
  //     sendFile();

  //     const interval = setInterval( _ => {
  //       let currentP;
  //       setCurrentPercentage( lastPercentage => {
  //         currentP = lastPercentage + 10;
  //         if ( currentP >= 100 ) return 100
  //         return currentP
  //       });
  //       if ( currentP >= 100 ) {
  //         clearInterval(interval);
  //         setStatus('sended')
  //       }
  //     }, 200);
  //   }, 15)
  // }

  // useEffect(_ => {
  //   testWorkFlow()
  // }, [])

  return (
    <div className={ classes.file }>
      <div className={ classes.fileInfo }>
        <FileIcon fileType={ data.type } />
        <div>
          <p className={ classes.name }>{ shortenName(data.name) }</p>
          <p className={ classes.size }>{ readableSize(data.size) }</p>
        </div>
      </div>
      <div className={ classes.progressState }>
        <FileProgress state={ status } currentPercentage={ currentPercentage }/>
      </div>
      <div className={ classes.actions }>
        <button onClick={ removeFile } className={ classes.deleteButton }>
          <IoClose />
        </button>
        <button className={ classes.sendButton }>
          <IoSend />
        </button>
      </div>
    </div>
  )
}

export default File