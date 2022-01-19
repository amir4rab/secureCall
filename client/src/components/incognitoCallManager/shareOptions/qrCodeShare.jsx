/* eslint-disable @next/next/no-img-element */
import { useState, useRef, useCallback, useEffect } from 'react'

import { IoShareSocial, IoDownload, IoClipboard } from 'react-icons/io5';

import { checkAvailability as checkAvailabilityFn, copyToClipboard, webShare } from '../../../utils/frontend/qrCodeFunctions/qrCodeFunctions';
import { qrCodeGenerator } from '../../../utils/frontend/qrCodeGenerator/qrCodeGenerator';

import classes from './shareOptions.module.scss';

function QrCodeShare({ url, displayState, fileName='qr code' }) {
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
    <div className={ classes.qrCodeShare }>
        <h3 className={ classes.title }>
          Qr code 
        </h3>
        <div className={ classes.imageWrapper }>
          <img ref={ imageRef } alt={ fileName } />
          <div className={ classes.overlay }>
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
      </div>
  )
}

export default QrCodeShare
