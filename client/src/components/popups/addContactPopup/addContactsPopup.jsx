import { useRef, useContext, useState } from 'react'
import { SocketsContext } from '../../../providers/socketsProvider/socketsProvider';
import useTranslation from 'next-translate/useTranslation';
import Popup from '../popup/popup';

import classes from './addContactsPopup.module.scss';

function AddContactsPopup({ displayState, setDisplayState }) {
  const { t } = useTranslation('addContactPopup');
  const { contactRequest } = useContext(SocketsContext);
  const [ isLoading, setIsLoading ] = useState(false);
  const [ error, setError ] = useState(null);
  const [ errorObj, setErrorObj ] = useState(null);
  const [ response, setResponse ] = useState(null);

  const inputRef = useRef();

  const formHandler = e => {
    e.preventDefault();

    console.log(inputRef.current.value)
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
        <h3 className={ classes.title }>
          { t('addContacts') }
        </h3>
        <form 
          className={ classes.form }
          onSubmit={ formHandler }
        >
          <div className={ classes.inputGroup }>
            <label>
              { t('rEmailAddress') }
            </label>
            <input ref={ inputRef } type="email" required placeholder='securecall@protonmail.com' />
          </div>
          <div className={ classes.response }>
            {
              isLoading ? <p className={ classes.loading }>{ t('loading') }</p> :
              error !== null ? <p className={ classes.error }>{ t(error.responseCode, { email: error.recipientEmail }) }</p> :
              response !== null ? <p className={ classes.response }>{ t(response.responseCode, { email: response.recipientEmail }) }</p> : null
            }
          </div>
          <button className={ classes.buttonWhite }>
            { t('sendRequest') }
          </button>
        </form>
      </div>
    </Popup>
  );
};

export default AddContactsPopup;
