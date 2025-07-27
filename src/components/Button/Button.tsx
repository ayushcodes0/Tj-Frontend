import Styles from './Button.module.css'

type ButtonProps = {
  text: string;
};

const FilledButton = ({text}:ButtonProps) => {
  return (
    <button className={Styles.filledButton}>
      {text}
    </button>
  )
}

export {FilledButton}

const UnfilledButton = ({text}:ButtonProps) => {
  return (
    <button className={Styles.unfilledButton}>
      {text}
    </button>
  )
}

export {UnfilledButton}

