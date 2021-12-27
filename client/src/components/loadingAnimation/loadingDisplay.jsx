import React from 'react'
import LoadingIcon from './loadingIcon/loadingIcon';

import classes from './loadingAnimation.module.scss'
import useTranslation from 'next-translate/useTranslation';

function LoadingDisplay({ children, text = null }) {
  const { t } = useTranslation('common');

  return (
    <div className={ classes.loadingDisplay } >
      <LoadingIcon className={ classes.loadingIcon } />
      <p className={ classes.text }>{ text === null ? `${t('loading')}...` : text }</p>
      <div className={ classes.childrenWrapper }>
        { children }
      </div>
    </div>
  )
}

export default LoadingDisplay
