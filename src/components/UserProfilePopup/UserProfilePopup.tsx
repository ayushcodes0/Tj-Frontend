import Styles from './UserProfilePopup.module.css'
import type { User } from '../../types/AuthTypes';

interface UserProfilePopupProps {
  onClose: () => void;
  user: User | null;    
}

const UserProfilePopup: React.FC<UserProfilePopupProps> = ({ user }) => {
  return (
    <div className={Styles.userProfilePopup}>
      <div className={Styles.popupContainer}>
        <div className={Styles.profileInfo}>
            <div className={Styles.userIcon}>
                <p className={Styles.firstLetter}>{user?.username[0].toUpperCase()}</p>
            </div>
            <div className={Styles.userInfo}>
                <p className={Styles.name}>{user?.username}'s Dashboard</p>
                <p className={Styles.email}>{user?.email}</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePopup;

