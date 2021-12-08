// import { useContext } from 'react';
import CallNotification from '../components/notifications/callNotification/callNotification';
// import Notification from '../components/notifications/notification/notification';

function NotificationOverlay({ children }) {

  return (
    <>
      <CallNotification />
      { children }
    </>
  );
};

export default NotificationOverlay;
