import classes from './box.module.scss';

function Box({ children, zIndex }) {
  return (
    <div className={ classes.box } style={{ zIndex: zIndex }}>
      { children }
    </div>
  )
}

export default Box
