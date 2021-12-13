import { motion } from 'framer-motion';
import classes from './sidebar.module.scss';
import useTranslation from 'next-translate/useTranslation';

function PopupButtons({ setAddContactPopup, setShowRequestsPopup }) {
  const { t } = useTranslation('sidebar');

  return (
    <>
      <motion.div
        layoutId="addContacts-body"
        className={ classes.addNewContact }
        onClick={ _ => setAddContactPopup(true) }
      >
        <motion.p layout="addContacts-title">{ t('addContact') }</motion.p>
      </motion.div>
      <motion.div
        className={ classes.addNewContact }
        onClick={ _ => setShowRequestsPopup(true) }
        layoutId="showRequests-body"
      >
        <motion.p layout="showRequests-title">{ t('requests') }</motion.p>
      </motion.div>
    </>
  )
}

export default PopupButtons
