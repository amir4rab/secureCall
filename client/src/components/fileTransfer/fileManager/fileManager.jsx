import { useState, useEffect, useRef, useCallback } from 'react'

import useWindowResize from '../../../utils/hooks/useWindowResize';
import { fileReader, fileUnifier } from '../../../utils/frontend/fileManager/fileManager';

import FileSidebar from '../fileSidebar/fileSidebar';
import DisplayFileTransferOverView from '../displayFileTransferOverView/displayFileTransferOverView';
import DisplayFileUpload from '../displayFileUpload/displayFileUpload';
import DisplayFileDownload from '../displayFileDownload/displayFileDownload';
import ExitPopup from '../exitPopup/exitPopup';
import { useRouter } from 'next/router';

import { 
  addToArrayItem, 
  removeItemFromArray, 
  appendChunk, 
  stateNameToPosition, 
  updateItemPercentage, 
  updateItemState, 
  removeFromMap,
  appendToMap 
} from './utils';

import classes from './fileManager.module.scss';

function FileManager({ message, clearMessage, sendMessage }) {
  const size = useWindowResize();
  const hiddenDownloadRef = useRef();
  const [ activePosition, setActivePosition ] = useState('overview');
  const [ currentOperation, setCurrentOperation ] = useState(null);
  const [ exitPopupState, setExitPopupState ] = useState(false);
  const [ notification, setNotifications ] = useState(null);
  const router = useRouter();

  //** file sending and receiving states and variables **//
  const [ fileData, setFileData ] = useState([]);
  const [ currentStagedFileInfo, setCurrentStagedFileInfo ] = useState(null);
  const currentRequestingChunk = useRef(0);

  //** summeryFiles states **//
  const [ summeryFiles, setSummeryFiles ] = useState([]);
  
  //** uploadFiles states **//
  const [ uploadFiles, setUploadFiles ] = useState([]);
  
  //** download states **// 
  const [ downloadFiles, setDownloadFiles ] = useState([]);
  const [ downloadUrls, setDownloadUrls ] = useState(new Map([]));

  //** functions **//
  const sendFile = async ( id ) => {
    if( currentOperation !== null ) return;
    const item = uploadFiles.find(item => item.id === id);
    sendMessage(JSON.stringify({
      event: 'fileInfoSend',
      data: {
        name: item.file.name,
        type: item.file.type,
        size: item.file.size,
        id: item.id
      }
    }))
    updateItemState(id, 'requested', setUploadFiles);
  };

  const rejectDownloadFile = async (id) => {
    if( currentOperation !== null ) return;
    sendMessage(JSON.stringify({
      event: 'sendedFileDeclined',
      data: id
    }));
    removeItemFromArray(id, setDownloadFiles);
  };

  const acceptDownloadFile = async (id) => {
    if( currentOperation !== null ) return;
    sendMessage( JSON.stringify({
      event: 'sendedFileRequested',
      data: id
    }));
    setCurrentOperation('downloading');
    updateItemState(id, 'requested', setDownloadFiles);
  };

  const cleanUp = useCallback( _ => {
    // variables and states cleanup for after competition of a file transfer //
    setCurrentOperation(null);
    setCurrentStagedFileInfo(null);
    setFileData([]);
    currentRequestingChunk.current = 0;
  }, []);

  const loadFile = useCallback( async (id) => {
    const item = uploadFiles.find( item => item.id === id );
    if ( item === null ) {
      console.error(`Couldn't find the Requested file!`);
      return;
    }
    const loadedFile = await fileReader(item.file, id);
    setFileData(loadedFile.dataArr)
    setCurrentStagedFileInfo(loadedFile.metadata);
    await sendMessage(JSON.stringify({
      event: 'fileIsReady',
      data: loadedFile.metadata,
    }));
  }, [ uploadFiles, sendMessage ]);

  const onFileReady = useCallback( async ( fileMetadata ) => {
    setCurrentStagedFileInfo(fileMetadata);
    currentRequestingChunk.current = 0;

    sendMessage(JSON.stringify({
      event: 'fileDataRequest',
      data: currentRequestingChunk.current,
    }))
  }, [ sendMessage ]);

  const onFileRequest = useCallback( async (chunkIndex) => {
    if( typeof chunkIndex !== 'number' ) {
      console.error(`onFileRequest: ChunkIndex should be type of number but received typeof ${typeof chunkIndex} instead!`);
      return;
    }
    sendMessage(JSON.stringify({
      event: 'fileData',
      data: fileData[chunkIndex]
    }))
    if( chunkIndex === 0 ) updateItemState(currentStagedFileInfo.id, 'sending', setUploadFiles);
    updateItemPercentage(currentStagedFileInfo.id, chunkIndex, currentStagedFileInfo.chunks ,setUploadFiles)
  }, [ sendMessage, fileData, currentStagedFileInfo ]);

  const onFileData = useCallback( async (chunk) => {
    if( typeof chunk !== 'string' ) {
      console.error(`onFileRequest: Chunk should be type of string but received typeof ${typeof chunk} instead!`);
      return;
    }

    const currentDataArr = await appendChunk( chunk, setFileData );
    updateItemState(currentStagedFileInfo.id, 'receiving', setDownloadFiles);
    updateItemPercentage(currentStagedFileInfo.id, currentRequestingChunk.current, currentStagedFileInfo.chunks, setDownloadFiles);

    currentRequestingChunk.current = currentRequestingChunk.current + 1;
    if ( currentRequestingChunk.current < currentStagedFileInfo.chunks ) {
      sendMessage(JSON.stringify({
        data: currentRequestingChunk.current,
        event: 'fileDataRequest'
      }));
    } else {
      console.log('Download completed!');
      sendMessage({
        event: 'fileTransferCompleted',
        data: currentStagedFileInfo.id
      })
      fileUnifier( currentDataArr, currentStagedFileInfo ).then( blob => {

        const url = URL.createObjectURL(blob);
        appendToMap( currentStagedFileInfo.id, { url, metadata: currentStagedFileInfo }, setDownloadUrls );
        updateItemState(currentStagedFileInfo.id, 'received', setDownloadFiles);

        // clean up after end of operation //
        cleanUp();
      });
    }
  }, [ sendMessage, currentStagedFileInfo, cleanUp ]);

  const downloadFile = useCallback( async ( id ) => {
    const { url, metadata } = downloadUrls.get(id);

    hiddenDownloadRef.current.href = url;
    hiddenDownloadRef.current.download = metadata.name;
    hiddenDownloadRef.current.click();
    URL.revokeObjectURL(url);
    removeFromMap(id, setDownloadUrls);

    // const data = downloadFiles.find( item => item.id === id );
    // console.log(metadata);
    addToArrayItem({ ...metadata, operation: 'receive' }, setSummeryFiles );

    updateItemState( id, 'downloaded', setDownloadFiles );

  }, [ downloadUrls ]);

  const onSendComplete = useCallback( async ( id ) => {
    updateItemState( id, 'sended', setUploadFiles );
    addToArrayItem(
      { name: currentStagedFileInfo.name, size: currentStagedFileInfo.size, type: currentStagedFileInfo.type, id , operation: 'send' },
      setSummeryFiles 
    );

    cleanUp();
  }, [ cleanUp, currentStagedFileInfo ]);

  const endSession = () => {
    router.push('/incognito')
  }


  //** main logic **//
  useEffect(() => {
    if ( message === null ) return;
    const { event, data } = JSON.parse(message);

    switch( event ) {
      //**-----------------------------**//
      //** file info transition Events **//
      //**-----------------------------**//
      case('fileInfoSend'):{ // receiving peer will receive data about the file
        addToArrayItem( { ...data, percentage: 0, state: 'waiting' }, setDownloadFiles );
        setNotifications('downloadEvent');
        break;
      };
      case('sendedFileDeclined'):{ // sending peer will receive id of the canceled file
        removeItemFromArray( data, setUploadFiles );
        break;
      };
      case('sendedFileRequested'):{ // sending peer will receive id of the requested file
        setCurrentOperation('uploading');
        // chunking file and sending it to the peer;
        // after file has became ready a message with chunk length should be sended to the peer;
        loadFile(data);
        break;
      };
      case('abortCurrentAction'):{ // sending/receiving peer will receive abort/cancellation event
        break;
      };
  
      //**-----------------------------**//
      //** file info transition Events **//
      //**-----------------------------**//
      case('fileIsReady'):{
        onFileReady(data);
        break;
      }
      case('fileData'):{
        onFileData(data);
        break;
      };
      case('fileDataRequest'):{
        onFileRequest(data);
        break;
      };
      case('fileTransferCompleted'): {
        onSendComplete(data);
        setNotifications('uploadEvent');
        break;
      }
    }
    
    clearMessage();
    }, [ message, clearMessage, loadFile, onFileReady, onFileRequest, onFileData, cleanUp, onSendComplete ])
  

  return (
    <div className={ classes.fileManager }>
      <ExitPopup 
        displayState={ exitPopupState } 
        setDisplayState={ setExitPopupState } 
        exitFunction={ endSession } 
      />
      <FileSidebar 
        notification={ notification } 
        clearNotification={ _ => setNotifications(null) } 
        activePosition={activePosition} 
        setActivePosition={setActivePosition} 
        endSession={ _ => setExitPopupState(true) }
      />
      <a style={{ display: 'none' }} ref={ hiddenDownloadRef }></a>
      <div className={ classes.content }>
        <div className={ classes.inner } style={{ transform: stateNameToPosition( activePosition, size ) }}>
          <DisplayFileTransferOverView 
            hidden={ activePosition !== 'overview' }
            dataArr={ summeryFiles }
            removeItem={ (id) => removeItemFromArray(id, setSummeryFiles) }
            addItem={ item => addToArrayItem(item,setSummeryFiles) }
            toDownload={ _ => setActivePosition('download') }
            toUpload={ _ => setActivePosition('upload') }
          />
          <DisplayFileUpload 
            hidden={ activePosition !== 'upload' }
            dataArr={ uploadFiles }
            removeItem={ (id) => removeItemFromArray( id, setUploadFiles ) }
            addItem={ item => addToArrayItem( item,setUploadFiles ) }
            sendFile={ sendFile }
          />
          <DisplayFileDownload 
            hidden={ activePosition !== 'download' } 
            dataArr={ downloadFiles }
            removeItem={ rejectDownloadFile }
            acceptFile={ acceptDownloadFile }
            downloadFile={ downloadFile }
          />
        </div>
      </div>
    </div>
  )
}

export default FileManager