import { useRef, useContext, useState } from 'react';
import { motion } from 'framer-motion';
import { SocketsContext } from '../../../providers/socketsProvider/socketsProvider';
import useTranslation from 'next-translate/useTranslation';
import Popup from '../popup/popup';

import { IoMail, IoShare } from 'react-icons/io5';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

import classes from './addContactsPopup.module.scss';
import ShareBtn from '../../buttons/shareBtn/shareBtn';

function AddContactsPopup({ displayState, setDisplayState }) {
  const { t } = useTranslation('addContactPopup');
  const { contactRequest } = useContext(SocketsContext);
  const [ isLoading, setIsLoading ] = useState(false);
  const [ error, setError ] = useState(null);
  const [ response, setResponse ] = useState(null);

  const inputRef = useRef();

  const formHandler = e => {
    e.preventDefault();

    setIsLoading(true);
    setError(null)
    setResponse(null)
    contactRequest(inputRef.current.value)
      .then( res => {
        if( res.status === 'error' ) {
          setError(res)
        } else {
          setResponse(res)
        }
        setIsLoading(false);
      });
  }

  return (
    <Popup
      displayState={ displayState } 
      setDisplayState={ setDisplayState }
    >
      <div className={ classes.addContactsPopupInner }> 
        <motion.h3 className={ classes.title }>
          { t('addContacts') }
        </motion.h3>
        <form 
          className={ classes.form }
          onSubmit={ formHandler }
        >
          <div className={ classes.inputGroup }>
            <label>
              { t('rEmailAddress') }
            </label>
            <div className={ classes.input }>
              <input ref={ inputRef } type="email" required placeholder='securecall@protonmail.com' />
              <IoMail />
            </div>
          </div>
          <div className={ classes.response }>
            {
              error?.responseCode === "userDNE" ? 
              <div className={ classes.invite }>
                <p className={ classes.text }>
                  { t('invite', { email: error.recipientEmail }) }
                </p>
                <ShareBtn copyValue={ process.env.NEXT_PUBLIC_WEBSTITE_URL } />
              </div>
              :
              error !== null ? <p className={ classes.error }>{ t(error.responseCode, { email: error.recipientEmail }) }</p> :
              response !== null ? <p className={ classes.response }>{ t(response.responseCode, { email: response.recipientEmail }) }</p> : null
            }
          </div>
          <div className={ classes.buttonWrapper }>
            <button disabled={ isLoading } className={ classes.submitBtn }>
              <p className={[ isLoading ? classes.visible : null, classes.loading ].join(' ')} >
                <AiOutlineLoading3Quarters />
              </p>
              <p className={ !isLoading ? classes.visible : null } >
                { t('sendRequest') }
              </p>
            </button>
          </div>
        </form>
      </div>
    </Popup>
  );
};

export default AddContactsPopup;
