import { useRouter } from 'next/router';
import setLanguage from 'next-translate/setLanguage'
import Selector from '../selector/selector';

import classes from './langSelector.module.scss';

function LangSelector({ horizontal= false }) {
  const router = useRouter();
  const eventHandler = ( value ) => {
    router.replace(router.route, '', {
      locale: value
    })
    // setLanguage(value);
  };

  return (
    <div className={ classes.wrapper }>
      <div className={ classes.langSelector }>
        <p>
          Language
        </p>
        <Selector
          horizontal={ horizontal }
          options={ router.locales }
          event={ eventHandler }
          defaultActiveOption={ router.locale }
        />
      </div>
    </div>
  )
}

export default LangSelector
