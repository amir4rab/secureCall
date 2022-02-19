import { IoGlobeOutline } from 'react-icons/io5';

import copyToClipboard from '../../../utils/frontend/copyToClipboard/copyToClipboard';

import classes from './shareOptions.module.scss';

function UrlShare({ url }) {
  return (
    <div className={ classes.shareItem }>
      <label htmlFor="incognitoId">Url</label>
      <button
        onClick={ _ => copyToClipboard(url) }
        className={ classes.itemBox }
      >
        <IoGlobeOutline />
        <p>{url}</p>
      </button>
    </div>
  )
}

export default UrlShare
