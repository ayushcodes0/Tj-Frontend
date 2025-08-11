import Styles from "./NewTradePopup.module.css"

interface NewTradePopupProps {
  onClose: () => void;
}

const NewTradePopup: React.FC<NewTradePopupProps> = ({ onClose }) => {
  return (
    <div className={Styles.newTradePopup} onClick={onClose}>
      New trade popup
    </div>
  )
}

export default NewTradePopup
