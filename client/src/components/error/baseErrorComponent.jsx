import { motion } from 'framer-motion';
import LangSelector from '../selectors/langSelector/langSelector';

import { IoGlobeOutline } from 'react-icons/io5'
import classes from './error.module.scss'


function BaseErrorComponent({ errorCode, children }) {
  return (
    <div className={ classes.errorWrapper }>
    <div className={ classes.errorCode }>{ errorCode }</div>
    <div className={ classes.langSelector }>
      <IoGlobeOutline />
      <LangSelector horizontal />
    </div>
    <div className={ classes.errorPage }>
      { children }
    </div>
  </div>
  );
}

export default BaseErrorComponent;
