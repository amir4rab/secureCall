import { useContext, useState } from 'react';

import { motion } from 'framer-motion';
import useTranslation from 'next-translate/useTranslation';

import { signOut } from 'next-auth/react';
import { IoChevronBack, IoKey, IoEyeOff, IoWarning, IoHappy, IoCalendar } from 'react-icons/io5';

import { ContactsContext } from '../../../providers/contactsProvider/contactsProvider';
import { SocketsContext } from '../../../providers/socketsProvider/socketsProvider';

import classes from './accountSection.module.scss';

import { parentVariants, MotionWrapper } from '../settingsAnimations';

function AccountSection({ close }) {
  const [ isLoading, setIsLoading ] = useState(false);
  const { blockList } = useContext(ContactsContext);
  const { unBanUser } = useContext(SocketsContext);
  const { t } = useTranslation('settings')
  const singOutEvent = () => {
    signOut({ callbackUrl: '/' })
  }

  const unBanUserEvent = async ( email ) => {
    setIsLoading(true);
    await unBanUser(email);
    setIsLoading(false);
  } 

  return (
    <motion.div variants={ parentVariants } initial='hidden' animate='visible' className={ classes.accountSection }>
      <div className={ classes.titleBox }>
        <button onClick={ close } className={ classes.backButton }><IoChevronBack /></button>
        <h3 className={ classes.title }>
          {t('settings')}
        </h3>
      </div>
      <div className={ classes.items }>
        <MotionWrapper className={ classes.groupItem }>
          <h4 className={ classes.groupTitle }>
            <div className={ classes.svgWrapper }><IoKey /></div>
            <p>{ t('accessTokens') }</p>
          </h4>
          <div>
            <div className={ classes.emptyElement }>
              <IoCalendar />
              <p>{ t('multiDeviceComingSoon') }</p>
            </div>
          </div>
        </MotionWrapper>
        <MotionWrapper className={[ classes.groupItem, classes.alignLeft ].join(' ')}>
          <h4 className={ classes.groupTitle }>
            <div className={ classes.svgWrapper }><IoEyeOff /></div>
            <p>{ t('blockedUsers') }</p>
          </h4>
          <div className={ classes.banList }>
            {
              blockList.map( blockedUserEmail => (
                <div className={ classes.banedUser } key={ blockedUserEmail }>
                  <p>{ blockedUserEmail }</p>
                  <button disabled={ isLoading } onClick={ _ => unBanUserEvent(blockedUserEmail) }>{t('unblock')}</button>
                </div>
              ))
            }
            {
              blockList.length === 0 ? 
              <div className={ classes.emptyElement }>
                <IoHappy />
                <p>{t('emptyBlock')}</p>
              </div> : null
            }
          </div>
        </MotionWrapper>
        <MotionWrapper className={[ classes.groupItem, classes.alignLeft ].join(' ')}>
          <h4 className={ classes.groupTitle }>
            <div className={ classes.svgWrapper }><IoWarning /></div>
            <p>{t('account')}</p>
          </h4>
          <button onClick={ singOutEvent } className={ classes.logoutBtn }>
            {t('logout')}
          </button>
        </MotionWrapper>
      </div>
    </motion.div>
  )
}

export default AccountSection
