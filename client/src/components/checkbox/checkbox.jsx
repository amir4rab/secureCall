import classes from './checkbox.module.scss';

function Checkbox({ children, setValue, value }) {
  return (
    <div className={ classes.checkbox }>
      <input checked={ value } onChange={ e => setValue(e.target.checked) } type="checkbox" />
      <p>{ children }</p>
    </div>
  )
}

export default Checkbox
