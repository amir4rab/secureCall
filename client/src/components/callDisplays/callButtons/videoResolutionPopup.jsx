import React from 'react';

import Popup from '../../popups/popup/popup';
import Selector from '../../selectors/selector/selector';

import classes from './callButtons.module.scss'

function VideoResolutionPopup({ displayState, setDisplayState, updateVideoResolution, currentVideoRes= 'medium' }) {
  return (
    <Popup displayState={ displayState } setDisplayState={ setDisplayState } >
      <div className={ classes.videoSettings }>
        <h4 className={ classes.title }>Settings</h4>
        <div className={ classes.settingsBox }>
          <label>Resolution</label>
          <Selector options={[ 'low', 'medium', 'high' ]} defaultActiveOption={ currentVideoRes } horizontal width="12.5ch" event={ e => updateVideoResolution( e, 'resolution' ) } />
        </div>
        <div className={ classes.settingsBox }>
          <label>Framerate</label>
          <Selector options={[ '24', '30', '60' ]} horizontal width="7ch" event={ e => console.log(e) } />
        </div>
      </div>
    </Popup>
  );
}

export default VideoResolutionPopup;
