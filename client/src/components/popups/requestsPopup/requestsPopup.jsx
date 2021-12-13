import { useContext, useState } from 'react'
import { motion } from 'framer-motion';
import { SocketsContext } from '../../../providers/socketsProvider/socketsProvider';
import { ContactsContext } from '../../../providers/contactsProvider/contactsProvider'

import Popup from '../popup/slPopup';

import classes from './requestsPopup.module.scss';

const layoutId = 'showRequests';

function RequestsPopup({ displayState, setDisplayState }) {
  const [ isLoading, setIsLoading ] = useState(false);

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
      layoutId={ layoutId }
      displayState={ displayState } 
      setDisplayState={ setDisplayState }
    >
      <div className={ classes.requestsPopupInner }> 
        <motion.h3 className={ classes.title } layoutId={`${layoutId}-title`}>
          Requests
        </motion.h3>
        <div className={ classes.requests }>
          {
            requests.map(request => (
              <div key={ request.email } className={ classes.request }>
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
                    Accept
                  </button>
                  <button 
                    disabled={ isLoading } 
                    className={ classes.buttonRed }
                    onClick={ _ => responseToRequestEvent( false, request.email, request.name ) }
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </Popup>
  )
};

export default RequestsPopup;
