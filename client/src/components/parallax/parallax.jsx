import { useState, useLayoutEffect, useRef } from 'react'
import { motion, useReducedMotion, useViewportScroll, useTransform } from 'framer-motion';
const Parallax = ({ children }) => {
  const [ initial, setInitial ] = useState(0);
  const [ final, setFinal ] = useState(0);

  const elementRef = useRef(null);

  const shouldReduceMotion = useReducedMotion();
  const { scrollY } = useViewportScroll();

  useLayoutEffect(() => {
    const element = elementRef.current

    const elementTop = element.getBoundingClientRect().top + window.scrollY || window.pageYOffset;
    const clientHeight = window.innerHeight;

    setInitial( elementTop - clientHeight );
    setFinal( elementTop - 0.5 );
  }, [ elementRef ]);

  const y = useTransform( scrollY, [ initial, final ], [ 0, -0.5 ], {
    clamp: false,
  });

  return (
    <motion.div ref={ elementRef } style={{ y: shouldReduceMotion ? 0 : y }}>
      { children }
    </motion.div>
  )
}

export default Parallax;