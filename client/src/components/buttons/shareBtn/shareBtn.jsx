import useTranslation from 'next-translate/useTranslation';
import { useEffect, useState } from 'react';
import { IoDocuments } from 'react-icons/io5';

import classes from './shareBtn.module.scss';

function ShareBtn({ copyValue }) {
  const { t } = useTranslation('common');
  const [ isCopied, setIsCopied ] = useState(false);

  useEffect( _ => {
    let timeout;
    if ( isCopied ) {
      timeout = setTimeout( _ => {
        setIsCopied(false)
      }, 5000 );
    }
    return () => {
      clearTimeout(timeout);
    }
  }, [ isCopied ]);

  const eventHandler = () => {
    try {
      navigator.clipboard.writeText(copyValue)
      setIsCopied(true);
    } catch {
      console.warn('Failed to copy text into clipboard!')
    }
  }

  return (
    <button type="button" onClick={ eventHandler } className={ classes.shareBtn }>
      <IoDocuments />
        {
          isCopied ?
          <p>
            {t('copied')}
          </p> 
          :
          <p>
            {t('copy')}
          </p>
        }
    </button>
  )
}

export default  ShareBtn;
