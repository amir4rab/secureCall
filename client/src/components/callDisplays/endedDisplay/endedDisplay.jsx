import { useContext } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';

import { ContactsContext } from '../../../providers/contactsProvider/contactsProvider';

import classes from './endedDisplay.module.scss';
import useTranslation from 'next-translate/useTranslation';

const getTime = (date) => {
  const currentDate = new Date().valueOf();
  const callLengthInSeconds = (currentDate - date)/1000;
  if ( callLengthInSeconds < 90 ) return `${callLengthInSeconds.toFixed(0)}s`;
  const callLengthInMinutes = callLengthInSeconds/60;
  if ( callLengthInMinutes < 90 ) return `${callLengthInMinutes.toFixed(0)}m`;
  const callLengthInHours = callLengthInMinutes/60;
  if ( callLengthInHours < 90 ) return `${callLengthInHours.toFixed(0)}h`;

}

function EndedDisplay({ email, callStartTime }) {
  const router = useRouter();
  const { getContact } = useContext(ContactsContext);
  const { t } = useTranslation('callDisplay');
  const { t: tCommon } = useTranslation('common');

  console.log(callStartTime);

  return (
    <motion.div
      animate={{ opacity: 1 }}
      initial={{ opacity: 0 }}
      className={ classes.endedDisplay }
    >
        <div className={ classes.titleBox }>
          <div className={ classes.imgBox }>
            { getContact(email).name.slice(0, 1) }
          </div>
          <div className={ classes.details }>
            <h4>{ getContact(email).name }</h4>
            <p>{ email }</p>
          </div>
        </div>
        <div className={ classes.callDetails }>
          {t('callEnded')}
        </div>
        {
          callStartTime !== null ? 
          <div>
            { getTime(callStartTime) }
          </div> : null
        }
        <div className={ classes.buttonsSection }>
          <button onClick={ _ => router.push('/panel') } className={ classes.buttonPrimary }>
            {tCommon('backToPanel')}
          </button>
        </div>
    </motion.div>
  )
}

export default EndedDisplay
