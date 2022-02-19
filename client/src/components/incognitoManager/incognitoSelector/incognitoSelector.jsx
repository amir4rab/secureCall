import useTranslation from 'next-translate/useTranslation';
import { useState } from 'react'
import DetailsShare from '../shareOptions/detailsShare';
import QrCodeShare from '../shareOptions/qrCodeShare';
import UrlShare from '../shareOptions/urlShare';

import classes from './incognitoSelector.module.scss';

const baseUrl = '/incognito/call?calling=false';

const calcActiveIndex = ( index ) => ({
  "left": `${ index * 33.3333 }%`, 
})

const calcStateStyle = ( index, activeIndex ) => ({ 
  "transform": `translate(-50%, 0%) translateX(${( index - activeIndex ) * 100}%)`, 
  "opacity": index === activeIndex ? 1 : 0  
})


function IncognitoSelector({ selfSecret,selfId }) {
  const [ activeIndex, setActiveIndex ] = useState(0);

  const clickEvent = (value) => {
    setActiveIndex(value);
  }

  const { t } = useTranslation('incognitoWaiting');

  return (
    <div className={ classes.incognitoSelector }>
      <div className={ classes.titles }>
        <button onClick={ _ => clickEvent(0) } className={[ classes.title, 0 === activeIndex ? classes.active : null ].join(' ')}>
          {t('url')}
        </button>
        <button onClick={ _ => clickEvent(1) } className={[ classes.title, 1 === activeIndex ? classes.active : null ].join(' ')}>
          {t('shareCallDetails')}
        </button>
        <button onClick={ _ => clickEvent(2) } className={[ classes.title, 2 === activeIndex ? classes.active : null ].join(' ')}>
          {t('qrCode')}
        </button>
        <div className={ classes.activeIndex } style={{ ...calcActiveIndex(activeIndex) }} />
      </div>
      <div className={ classes.items }>
        <div className={ classes.item } style={{ ...calcStateStyle( 0, activeIndex ) }} >
          <UrlShare 
            selfSecret={ selfSecret } selfId={ selfId }
            url={`${window.location.href.replace('?initializer=false', '')}?initializer=true#id=${selfId}&secret=${selfSecret}`}
          />
        </div>
        <div className={ classes.item } style={{ ...calcStateStyle( 1, activeIndex ) }} >
          <DetailsShare selfSecret={ selfSecret } selfId={ selfId } />
        </div>
        <div className={ classes.item } style={{ ...calcStateStyle( 2, activeIndex ) }} >
          <QrCodeShare 
            url={`${window.location.href.replace('?initializer=false', '')}?initializer=true#id=${selfId}&secret=${selfSecret}`}
            displayState={ activeIndex === 2 } 
          />
        </div>
      </div>
    </div>
  )
}

export default IncognitoSelector
