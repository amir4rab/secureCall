import React, { useContext, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';

import useTranslation from 'next-translate/useTranslation';
import { IoArrowBack, IoEllipsisVertical, IoCall, IoVideocam } from 'react-icons/io5';

import { ContactsContext } from '../../../providers/contactsProvider/contactsProvider';

import classes from './contactCard.module.scss';
import ContactSettings from './contactSettings';

function ContactCard() {
  const { setActiveContact, activeContact: contact } = useContext(ContactsContext);
  const [ settingsState, setSettingsState ] = useState(false);
  const router = useRouter();
  const { t } = useTranslation('contactCard');

  const callUser = (callType) => {
    router.push({
      pathname: 'panel/call',
      query: {
        callTo: contact.email,
        callType,
        calling: true
      }
    })
  }

  return (
    <motion.div className={ classes.contactCard }>
      <ContactSettings state={ settingsState } setState={setSettingsState} email={ contact?.email } />
      <div className={ classes.details }>
        <div className={ classes.imageWrapper }>
          <div className={ classes.image }>{ contact.name.slice(0,1).toUpperCase() }</div>
        </div>
        <div className={ classes.backButton }>
          <button onClick={ _ => setActiveContact(null) }>
            <IoArrowBack />
          </button>
        </div>
        <div className={ classes.info }>
          <h2 className={ classes.email }>{ contact.email }</h2>
          <h4 className={ classes.name }>{ contact.name }</h4>
        </div>
        <div className={ classes.settingsIconWrapper }>
          <button onClick={ _ => setSettingsState(true) } className={ classes.settingsIcon }>
            <IoEllipsisVertical />
          </button>
        </div>
      </div>
      <div className={ classes.controlGroup }>
        <div className={ classes.header }>
          { t('call') }
        </div>
        <div className={ classes.buttons }>
          <button 
            className={ classes.button }
            onClick={ _ => callUser('video') }
          >
            <IoVideocam />
            <p className={ classes.title }>
              { t('videoCall') }
            </p>
          </button>
          <button 
            className={ classes.button }
            onClick={ _ => callUser('audio') }
          >
            <IoCall />
            <p className={ classes.title }>
              { t('audioCall') }
            </p>
          </button>
        </div>
      </div>
    </motion.div>
  )
};

export default ContactCard;
