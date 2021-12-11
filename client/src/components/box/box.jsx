import classes from './box.module.scss';

function Box({ children }) {
  return (
    <div className={ classes.box }>
      { children }
    </div>
  )
}

export default Box
