import { useRouter } from 'next/router';
import classes from './incognitoCallBtn.module.scss';

import { IoGlasses } from 'react-icons/io5';

function IncognitoCallBtn() {
  const router = useRouter();

  const eventHandler = () => {
    router.push('/incognito')
  }

  return (
    <button onClick={ eventHandler } role='link' className={ classes.incognitoCallBtn }>
      <IoGlasses />
      Start a incognito call
    </button>
  )
}

export default IncognitoCallBtn
