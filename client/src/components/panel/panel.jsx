import { useContext, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

import Sidebar from '../sidebar/sidebar';
import classes from './panel.module.scss';
import ContactDisplay from '../contactDisplay/contactDisplay';
import { motion, LayoutGroup } from 'framer-motion';
import { generateFade } from '../../animations/fade';
import { SocketsContext } from '../../providers/socketsProvider/socketsProvider';
import AddContactsPopup from '../popups/addContactPopup/addContactsPopup';
import RequestsPopup from '../popups/requestsPopup/requestsPopup';

const fadeAnimation = generateFade({ 
  from:'up', 
  distance: '1rem',
  duration: '.3',
  delay:'.15' 
});

function Panel() {
  const [ addContactPopup, setAddContactPopup ] = useState(false);
  const [ showRequestsPopup, setShowRequestsPopup ] = useState(false);
  const {
    isConnected
  } = useContext(SocketsContext);


  return (
    <LayoutGroup>
      <AddContactsPopup 
        displayState={ addContactPopup } 
        setDisplayState={ setAddContactPopup } 
      />
      <RequestsPopup
        displayState={ showRequestsPopup } 
        setDisplayState={ setShowRequestsPopup } 
      />
      {
        isConnected ?
        <motion.div 
          className={ classes.panel }
          variants={ fadeAnimation }
          animate='visible'
          initial='hidden'
          hidden='hidden'
        >
          <div className={ classes.inner } >
            <Sidebar setAddContactPopup={ setAddContactPopup } setShowRequestsPopup={ setShowRequestsPopup }  />
            <ContactDisplay />
          </div>
        </motion.div>
        : null
      }
    </LayoutGroup>
  )
}

export default Panel
