import { useEffect } from 'react';
import { motion } from 'framer-motion';

import { useInView } from 'react-intersection-observer';

const variants = {
  visible: {
    opacity: 1
  },
  hidden: {
    opacity: 0
  }
}

function SectionWrapper({ children }) {
  const { ref, inView } = useInView({
    threshold: 0.25
});

  return (
    <motion.div ref={ ref } variants={ variants } animate={ inView ? 'visible' : 'hidden' } initial="hidden" >
      { children }
    </motion.div>
  )
}

export default SectionWrapper
