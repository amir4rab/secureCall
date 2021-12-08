import { useContext } from 'react'
import { useRouter } from 'next/router';

import Notification from '../notification/notification';
import { SocketsContext } from '../../../providers/socketsProvider/socketsProvider';

import classes from './callNotification.module.scss';

function CallNotification() {
  const router = useRouter();
  const { 
    receivingCall, 
    callIsAnswered,
    answerCall,
    declineCall
  } = useContext(SocketsContext);

  const answerCallEvent = _ => {
    answerCall(receivingCall.from);
    router.push(`/call?to=${receivingCall.from}&type=${receivingCall.type}&calling=false`);
  }

  const declineCallEvent = _ => {
    declineCall(receivingCall.from);
  }

  return (
    <Notification isVisible={ receivingCall !== null && !callIsAnswered }>
      <div className={ classes.notificationInner }>
        <div className={ classes.left }>
          {
            `${receivingCall?.name} is calling you`
          }
        </div>
        <div className={ classes.right }>
          <button onClick={ answerCallEvent } className={ classes.buttonGreen }>
            Answer
          </button>
          <button onClick={ declineCallEvent } className={ classes.buttonRed }>
            Decline
          </button>
        </div>
      </div>
    </Notification>
  )
}

export default CallNotification
