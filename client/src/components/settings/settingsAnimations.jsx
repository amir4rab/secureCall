import { motion } from 'framer-motion';

export const parentVariants = {
  hidden: { opacity: 0, },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
}

export const MotionWrapper = ({ children, className, style }) => (
  <motion.div className={ className } style={ style } variants={{ 'visible': { opacity: 1, y: '0rem' }, 'hidden': { opacity: 0, y: '-.5rem' } }}>{children}</motion.div>
);