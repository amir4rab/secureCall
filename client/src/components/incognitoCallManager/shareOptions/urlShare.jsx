import { IoGlobeOutline } from 'react-icons/io5';

import copyToClipboard from '../../../utils/frontend/copyToClipboard/copyToClipboard';

import classes from './shareOptions.module.scss';

function UrlShare({ selfId, selfSecret }) {
  return (
    <div className={ classes.shareItem }>
      <label htmlFor="incognitoId">Url</label>
      <button
        onClick={ _ => copyToClipboard(`${window.location.href}/incognito/call?calling=true#id=${selfId}&secret=${selfSecret}`) }
        className={ classes.itemBox }
      >
        <IoGlobeOutline />
        <p>{`${window.location.href}/incognito/call?calling=true#id=${selfId}&secret=${selfSecret}`}</p>
      </button>
    </div>
  )
}

export default UrlShare
