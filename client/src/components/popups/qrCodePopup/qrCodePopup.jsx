/* eslint-disable @next/next/no-img-element */
import { useEffect, useCallback, useRef, useState } from 'react';

import { IoShareSocial, IoCloudDownload, IoClipboard, IoDownload } from 'react-icons/io5';

import classes from './qrCodePopup.module.scss';
import useTranslation from 'next-translate/useTranslation';
import qrCodeGenerator from '../../../utils/frontend/qrCodeGenerator/qrCodeGenerator';
import { checkAvailability as checkAvailabilityFn, copyToClipboard, webShare } from '../../../utils/frontend/qrCodeFunctions/qrCodeFunctions';

import Popup from '../popup/popup';

function QrCodePopup({ url='https://amir4rab.com', title='qr code', fileName='qr code', displayState, setDisplayState }) {
  const [ cashedValue, setCashedValue ] = useState({ url: null, imageData: null }); 
  const [ availability, setAvailability ] = useState({ share: false, copy: false })
  const downloadRef = useRef();
  const imageRef = useRef();

  const init = useCallback(
    async ( url ) => {
      let imageData;
      if ( url === cashedValue.url ) {
        imageData = cashedValue.imageData;
      } else {
        imageData = await qrCodeGenerator(url);
        console.log(`imageData calculated!`);
        setCashedValue({ url, imageData: imageData })
      }
      imageRef.current.src = imageData;
      downloadRef.current.href = imageData;
    },
    [ cashedValue ],
  );

  const checkAvailability = useCallback(() => {
    const currentAvailabilities = checkAvailabilityFn();
    setAvailability({ ...currentAvailabilities });
  }, []);

  useEffect( _ => {
    checkAvailability();
  }, [ checkAvailability ])

  useEffect(() => {
    if ( displayState ) init(url);
  }, [ init, displayState, url ])

  return (
    <Popup
      displayState={ displayState } 
      setDisplayState={ setDisplayState }
    >
      <div className={ classes.qrCodePopup }>
        <h3 className={ classes.title }>
          { title }
        </h3>
        <div className={ classes.imageWrapper }>
          <img style={{ width: '300px', height: '300px' }} ref={ imageRef } alt={ fileName } />
        </div>
        <div className={ classes.buttonsSection }>
          <button disabled={ !availability.share } onClick={ _ => webShare( cashedValue.imageData, fileName ) } className={ classes.button }>
            <div className={ classes.svgWrapper }>
              <IoShareSocial />
            </div>
            <p>Share</p>
          </button>
          <a target='_blank' rel='noreferrer' ref={ downloadRef } download={ fileName } className={ classes.button }>
            <div className={ classes.svgWrapper }>
              <IoDownload />
            </div>
            <p>Download</p>
          </a>
          <button disabled={ !availability.copy } onClick={ _ => copyToClipboard( cashedValue.imageData ) } className={ classes.button }>
            <div className={ classes.svgWrapper }>
              <IoClipboard />
            </div>
            <p>Copy</p>
          </button>
        </div>
      </div>
    </Popup>
  )
}

export default QrCodePopup
