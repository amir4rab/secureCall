import { useCallback, useEffect, useState } from 'react';

import { IoShieldOutline, IoShieldCheckmark } from 'react-icons/io5';
import { AiOutlineLoading } from 'react-icons/ai';

import emojiObj from './emojiObj.json';

import classes from './verifyCall.module.scss';
import VerifyCallModalInner from './verifyCallModalInner/verifyCallModalInner';

function VerifyCall({ hashObj }) {
  const [ emojiArr, setEmojiArr ] = useState([]);
  const [ callIsVerified, setCallIsVerified ] = useState(false);
  const [ isModalOpen, setIsModalOpen ] = useState(false);
  const [ isInitialized, setIsInitialized ] = useState(false);
  const [ removeModal, setRemoveModal ] = useState(false);

  const closeModalClick = (e) => {
    if( e.target.id === 'verifyCallModalWrapper' ) setIsModalOpen(false);
  }

  const generateEmojiString = useCallback(( hash, logTime= false ) => {
    const startTime = performance.now();

    const mappedArr = [];
    for ( let i = 0 ; i < hash.length ; i = i+2 ) {
      const char = hash.slice(i, i+2);
      mappedArr.push({ char, emoji: emojiObj[char] })
    }
    setEmojiArr(mappedArr);
    setIsInitialized(true);
    if( logTime ) console.log(`Generating mapped emojis took ${ performance.now() - startTime }ms`);
  }, []);

  useEffect( _ => {
    if( hashObj !== null ) generateEmojiString( hashObj.hash , true );
  }, [ generateEmojiString, hashObj ]);

  useEffect( _ => {
    let timeout;
    if ( callIsVerified ) setTimeout( _ => {
      setRemoveModal(true);
    }, 500);
    return () => {
      clearTimeout(timeout);
    }
  }, [ callIsVerified ])

  const setIsVerified = _ => {
    setCallIsVerified(true);
    setIsModalOpen(false);
  }

  const openModalEvent = () => {
    if ( isInitialized && !callIsVerified ) setIsModalOpen(true)
  }

  return (
    <div className={ classes.verifyCall }>
      <div className={ classes.buttonWrapper }>
        <button 
          onClick={ openModalEvent } 
          className={[ 
            classes.verifyButton,
            !isInitialized ? classes.loading : callIsVerified ? classes.verified: classes.unverified 
          ].join(' ')}
        >
          <IoShieldOutline className={ classes.unverifiedIcon } />
          <IoShieldCheckmark className={ classes.verifiedIcon } />
          <AiOutlineLoading className={ classes.loadingIcon } />
          <div className={ classes.hint }>
            hint
          </div>
        </button>
      </div>
      {
        !removeModal ?
        <div id="verifyCallModalWrapper" onClick={ closeModalClick } className={[ classes.modalWrapper, isModalOpen ? classes.open : null ].join(' ')}>
          {
            emojiArr.length !== 0 ?
            <VerifyCallModalInner emojiArr={ emojiArr } setIsVerified={ setIsVerified } close={ _ => setIsModalOpen(false) } /> : null
          }
        </div> : null
      }
    </div>
  )
}

export default VerifyCall
