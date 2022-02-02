import { useState } from 'react';

import useTranslation from 'next-translate/useTranslation';

import { IoAdd, IoClose } from 'react-icons/io5';

import classes from './mobileMenu.module.scss';

function MobileMenuBase({ dataArr= [] }) {
  const { t } = useTranslation('common');
  const [ modalState, setModalState ] = useState(false);

  const overlayEventHandler = e => {
    console.log(e.target.id);
    if( e.target.id === 'mobileMenuOverlay' ) {
      setModalState(false);
    }
  }

  return (
    <div className={[ classes.mobileMenu, modalState ? classes.open : classes.close ].join(' ')}>
      <button className={ classes.button } onClick={ _ => setModalState(true) }>
        <IoAdd />
      </button>
      <div className={ classes.modal }>
        <div className={ classes.modalInner }>
          <button onClick={ _ => setModalState(false) } className={ classes.closeBtn }>
            <IoClose />
          </button>
          {
            dataArr.map( item => (
              <button key={ item.key } onClick={ item.event } className={ classes.imageBtn }>
                <div className={ classes.svgWrapper }>
                  { item.img }
                </div>
                <p>{ t(item.i18Key) }</p>
              </button>
            ))
          }
        </div>
      </div>
      <div className={ classes.overlay } id='mobileMenuOverlay' onClick={ overlayEventHandler }>
      </div>
    </div>
  )
}

export default MobileMenuBase
