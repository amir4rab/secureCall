import { useRouter } from 'next/router';
import classes from './incognitoCallBtn.module.scss';

import { IoGlasses } from 'react-icons/io5';
import useTranslation from 'next-translate/useTranslation';

function IncognitoCallBtn() {
  const { t } = useTranslation('common')
  const router = useRouter();

  const eventHandler = () => {
    router.push('/incognito')
  }

  return (
    <button onClick={ eventHandler } role='link' className={ classes.incognitoCallBtn }>
      <IoGlasses />
      {t('startIncognitoCall')}
    </button>
  )
}

export default IncognitoCallBtn
