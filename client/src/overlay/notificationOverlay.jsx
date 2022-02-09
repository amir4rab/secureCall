import CallNotification from '../components/notifications/callNotification/callNotification';

function NotificationOverlay({ children }) {

  return (
    <>
      <CallNotification />
      { children }
    </>
  );
};

export default NotificationOverlay;
