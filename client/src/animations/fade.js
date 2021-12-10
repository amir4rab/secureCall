const duration = .4;
const transitionDistance = '1rem'

export const fadeUp = {
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration
    }
  },
  hidden: {
    y: `-${transitionDistance}`,
    opacity: 0,
    transition: {
      duration
    }
  } 
};

export const fadeDown = {
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration
    }
  },
  hidden: {
    y: `${transitionDistance}`,
    opacity: 0,
    transition: {
      duration
    }
  } 
};

export const fadeLeft = {
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration
    }
  },
  hidden: {
    x: `-${transitionDistance}`,
    opacity: 0,
    transition: {
      duration
    }
  } 
};

export const fadeRight = {
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration
    }
  },
  hidden: {
    x: `${transitionDistance}`,
    opacity: 0,
    transition: {
      duration
    }
  } 
};

export const generateFade = ({ from, distance, duration, delay }) => {
  const visible = {
    opacity: 1,
    transition: {
      duration,
      delay
    }
  };
  const hidden = {
    opacity: 0,
    transition: {
      duration,
      delay
    }
  };
  switch(from) {
    case 'down': {
      visible['y'] = 0;
      hidden['y'] = `${distance}`;
      break;
    }
    case 'up': {
      visible['y'] = 0;
      hidden['y'] = `-${distance}`;
      break;
    }
    case 'right': {
      visible['x'] = 0;
      hidden['x'] = `${distance}`;
      break;
    }
    case 'left': {
      visible['x'] = 0;
      hidden['x'] = `-${distance}`;
      break;
    }
  }
  return ({
    visible,
    hidden
  });
}