import { useContext } from 'react'
import { useRouter } from 'next/router';

import Notification from '../notification/notification';
import { SocketsContext } from '../../../providers/socketsProvider/socketsProvider';

import { IoVideocam, IoClose, IoCall } from 'react-icons/io5';

import classes from './callNotification.module.scss';

function CallNotification() {
  const router = useRouter();
  const { 
    receivingCall, 
    callIsAnswered,
    answerCall,
    declineCall
  } = useContext(SocketsContext);

  console.log(receivingCall);

  const answerCallEvent = _ => {
    answerCall(receivingCall.from);
    router.push(`panel/call?callTo=${receivingCall.from}&type=${receivingCall.type}&calling=false`);
  }

  const declineCallEvent = _ => {
    declineCall(receivingCall.from);
  }

  return (
    <Notification isVisible={ receivingCall !== null && !callIsAnswered }>
      <div className={ classes.notificationInner }>
        <div className={ classes.left }>
          <p className={ classes.name }>{`${receivingCall?.name}`}</p>
          <p className={ classes.email }>{`${receivingCall?.from}`}</p>
        </div>
        <div className={ classes.right }>
          {
            receivingCall?.type === 'video' ?
            <>
              <button onClick={ answerCallEvent } className={ classes.buttonGreen }>
                <IoVideocam />
              </button>
              <button onClick={ declineCallEvent } className={ classes.buttonRed }>
                <IoClose />
              </button>
            </>
            :
            <>
              <button onClick={ answerCallEvent } className={ classes.buttonGreen }>
                <IoCall />
              </button>
              <button onClick={ declineCallEvent } className={ classes.buttonRed }>
                <IoClose />
              </button>
            </>
          }
        </div>
      </div>
    </Notification>
  )
}

export default CallNotification
