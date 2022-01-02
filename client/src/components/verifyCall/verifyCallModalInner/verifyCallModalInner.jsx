import { useCallback, useState } from 'react';

import useTranslation from 'next-translate/useTranslation';

import classes from './VerifyCallModalInner.module.scss';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';

const calcPosition = ( index, activeIndex ) => `translate(-50%,-50%) translateX(${ activeIndex === index ? '-0%' : `${( activeIndex - index) * - 100}%` })`;

function VerifyCallModalInner({ emojiArr, setIsVerified }) {
  const [ chunks, setChunks ] = useState([]);
  const [ activeIndex, setActiveIndex ] = useState(0);
  const { t } = useTranslation('verifyCall');
  const { t: commonT } = useTranslation('common');

  const fragmenter = useCallback((emojiArr) => {
    const chunkedArr = [];
    console.log(emojiArr.length/8);
    for ( let i = 0 ; i < emojiArr.length ; i = i+8 ) {
      console.log(emojiArr.slice(i, i+7), i, i+7)
      chunkedArr.push(emojiArr.slice(i, i+7));
    }
    setChunks(chunkedArr);
  }, [])

  useState( _ => {
    fragmenter(emojiArr);
  }, [ emojiArr ]);

  const changeActiveIndex = ( input ) => {
    console.log(input)
    if( input === true ) {
      if ( activeIndex + 1 <= chunks.length ) setActiveIndex( activeIndex + 1 );
    } else {
      if ( activeIndex - 1 >= 0 ) setActiveIndex( activeIndex - 1 );
    }
  };

  return (
    <div className={ classes.verifyCallModalInner }>
      <p className={ classes.title }>
        {t('verifyPrompt')}
      </p>
      <p className={ classes.subtitle }>
        {t('error')}
      </p>
      <div className={ classes.emojiSection }>
        <div className={ classes.emojisWrapper }>
          {
            chunks.map((emojiGroup, i) => (
              <div className={ classes.group } style={{ transform: calcPosition( i, activeIndex ), opacity: i === activeIndex ? 1 : 0 }} key={ i }>
                {
                  emojiGroup.map(( item, index ) => <p className={ classes.item } key={ `${index}-${item.char}` }>{ item.emoji }</p>)
                }
              </div>
            ))
          }
          <div className={ classes.group } style={{ transform: calcPosition( chunks.length, activeIndex ), opacity: chunks.length === activeIndex ? 1 : 0 }}>
            <button onClick={ setIsVerified } className={ classes.confirmButton }>
              {commonT('confirm')}
            </button>
          </div>
        </div>
        <div className={ classes.buttonsSection }>
          <button disabled={!( activeIndex - 1 >= 0 )} onClick={ _ => changeActiveIndex(false) } className={ classes.backButton }>
            <IoChevronBack />
          </button>
          <div className={ classes.position }>
          {
            chunks.map(( _, i ) => (
              <div className={[ classes.item, activeIndex > i ? classes.done : null ].join(' ')} key={ i }></div>
            ))
          }
        </div>
          <button disabled={!( activeIndex + 1 <= chunks.length )} onClick={ _ => changeActiveIndex(true) } className={ classes.nextButton }>
            <IoChevronForward />
          </button>
        </div>
      </div>
    </div>
  )
}

export default VerifyCallModalInner
