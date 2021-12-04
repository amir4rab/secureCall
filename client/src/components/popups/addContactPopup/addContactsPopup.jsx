import { useRef, useContext, useState } from 'react'
import { SocketsContext } from '../../../providers/socketsProvider/socketsProvider';

import Popup from '../popup/popup';

import classes from './addContactsPopup.module.scss';

function AddContactsPopup({ displayState, setDisplayState }) {
  const { contactRequest } = useContext(SocketsContext);
  const [ isLoading, setIsLoading ] = useState(false);
  const [ error, setError ] = useState(null);
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
          setError(res.response)
        } else {
          setResponse(res.response)
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
          Add contacts
        </h3>
        <form 
          className={ classes.form }
          onSubmit={ formHandler }
        >
          <div className={ classes.inputGroup }>
            <label>
              Recipient EmailAddress
            </label>
            <input ref={ inputRef } type="email" required placeholder='securecall@protonmail.com' />
          </div>
          <div className={ classes.response }>
            {
              isLoading ? <p className={ classes.loading }>Loading</p> :
              error !== null ? <p className={ classes.error }>{ error }</p> :
              response !== null ? <p className={ classes.response }>{ response }</p> : null
            }
          </div>
          <button className={ classes.buttonWhite }>
            Send Request
          </button>
        </form>
      </div>
    </Popup>
  );
};

export default AddContactsPopup;
