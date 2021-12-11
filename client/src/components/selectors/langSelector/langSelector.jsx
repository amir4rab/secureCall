import router, { useRouter } from 'next/router';
import Selector from '../selector/selector'

import classes from './langSelector.module.scss';

function LangSelector({ horizontal= false }) {
  const router = useRouter();
  const eventHandler = ( value ) => {
    router.push(router.route, '', {
      locale: value
    })
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
