import { useContext, useEffect, useState } from 'react';
import { LayoutGroup } from 'framer-motion';

import Sidebar from '../sidebar/sidebar';
import ContactDisplay from '../contactDisplay/contactDisplay';

import { SocketsContext } from '../../providers/socketsProvider/socketsProvider';

import classes from './panel.module.scss';

function Panel() {
  const {
    isConnected
  } = useContext(SocketsContext);


  return (
    <>
      {
        isConnected ?
        <div className={ classes.panel } >
          <div className={ classes.inner } >

              <Sidebar />
              <ContactDisplay />
          </div>
        </div>
        : null
      }
    </>
  )
}

export default Panel
