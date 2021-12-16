import { useContext, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion';
import { SocketsContext } from '../../../providers/socketsProvider/socketsProvider';
import { ContactsContext } from '../../../providers/contactsProvider/contactsProvider'

import { IoCheckmark, IoClose, IoMailOpen } from 'react-icons/io5';

import Popup from '../popup/popup';

import classes from './requestsPopup.module.scss';
import useTranslation from 'next-translate/useTranslation';

const contactsVariants = {
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.15,
    },
  },
  hidden: {
    opacity: 0,
    transition: {
      when: "afterChildren",
    },
  },
}

const contactVariants = { 
  visible: { 
    opacity: 1, 
    y: 0,
    transition:{ ease: [0.17, 0.67, 0.83, 0.67] }
  },
  hidden: { 
    opacity: 0, 
    y: '-1rem',
    transition:{ ease: [0.17, 0.67, 0.83, 0.67] }
  },
}

function RequestsPopup({ displayState, setDisplayState }) {
  const [ isLoading, setIsLoading ] = useState(false);
  const { t } = useTranslation('requests');

  const { requests, addContact } = useContext(ContactsContext);
  const { responseToRequest } = useContext(SocketsContext);

  const responseToRequestEvent = async ( response, email, name ) => {
    setIsLoading(true);
    const socketResponse = await responseToRequest( email, response );
    if ( socketResponse.status === 'successful' && response ) {
      addContact({
        name,
        email
      })
    }
    setIsLoading(false);
  }

  return (
    <Popup
      displayState={ displayState } 
      setDisplayState={ setDisplayState }
    >
      <div className={ classes.requestsPopupInner }> 
        <motion.h3 className={ classes.title }>
          { t('requests') }
        </motion.h3>
        <motion.div
          variants={ contactsVariants }
          className={ classes.requests }
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence>
            {
              requests.map(request => (
                <motion.div variants={ contactVariants } exit='hidden' key={ request.email } className={ classes.request }>
                  <div className={ classes.mainDetails }>
                    <p className={ classes.name }>
                      { request.name }
                    </p>
                    <p className={ classes.email }>
                      { request.email }
                    </p>
                  </div>
                  <div className={ classes.buttons }>
                    <button 
                      disabled={ isLoading } 
                      className={ classes.buttonGreen }
                      onClick={ _ => responseToRequestEvent( true, request.email, request.name ) }
                    >
                      <p className={ classes.svgWrapper }><IoCheckmark/></p>
                    </button>
                    <button 
                      disabled={ isLoading } 
                      className={ classes.buttonRed }
                      onClick={ _ => responseToRequestEvent( false, request.email, request.name ) }
                    >
                      <p className={ classes.svgWrapper }><IoClose/></p>
                    </button>
                  </div>
                </motion.div>
              ))
            }
            {
              requests.length === 0 ? 
              <motion.div 
                visible={{ opacity: 1 }}
                hidden={{ opacity: 0 }}
                exit={{ opacity: 0 }}
                className={ classes.empty }
              >
                <IoMailOpen />
                <p>
                  { t('empty') }
                </p>
              </motion.div> : null
            }
          </AnimatePresence>
        </motion.div>
      </div>
    </Popup>
  )
};

export default RequestsPopup;
