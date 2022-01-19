import { IoKey, IoPerson } from 'react-icons/io5';

import copyToClipboard from '../../../utils/frontend/copyToClipboard/copyToClipboard';

import classes from './shareOptions.module.scss';

function DetailsShare({ selfId, selfSecret }) {
  return (
    <div className={ classes.shareItem }>
      <label htmlFor="incognitoId">ID</label>
      <button
        onClick={ _ => copyToClipboard(selfId) } 
        className={ classes.itemBox }
      >
        <IoPerson />
        <p>{selfId}</p>
      </button>
      <label htmlFor="incognitoSecret">Secret</label>
      <button
        onClick={ _ => copyToClipboard(selfSecret) } 
        className={ classes.itemBox }
      >
        <IoKey />
        <p>{selfSecret}</p>
      </button>
    </div>
  )
}

export default DetailsShare
