import { IoGlobeOutline } from 'react-icons/io5';

import copyToClipboard from '../../../utils/frontend/copyToClipboard/copyToClipboard';

import classes from './shareOptions.module.scss';

function UrlShare({ selfId, selfSecret }) {
  return (
    <div className={ classes.shareItem }>
      <label htmlFor="incognitoId">Url</label>
      <button
        onClick={ _ => copyToClipboard(`https://localhost:3000/incognito/call?calling=true#id=${selfId}&secret=${selfSecret}`) }
        className={ classes.itemBox }
      >
        <IoGlobeOutline />
        <p>{`https://localhost:3000/incognito/call?calling=true#id=${selfId}&secret=${selfSecret}`}</p>
      </button>
    </div>
  )
}

export default UrlShare
