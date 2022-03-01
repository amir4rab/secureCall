import { motion } from 'framer-motion'

import classes from './connectionTypeSwitch.module.scss';

function ConnectionTypeSwitch({ setConnectionType, connectionType }) {
  return (
    <motion.div className={ classes.connectionTypeSwitch }>
      <button className={[ connectionType === 'video' ? classes.active : null ].join(' ')} onClick={ _ => setConnectionType('video') }>
        Video
      </button>
      <button className={[ connectionType === 'data' ? classes.active : null ].join(' ')} onClick={ _ => setConnectionType('data') }>
        Data
      </button>
    </motion.div>
  )
}

export default ConnectionTypeSwitch