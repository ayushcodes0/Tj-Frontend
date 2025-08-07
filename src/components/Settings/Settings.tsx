import { useRef, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import Styles from "./Settings.module.css";

const Settings = () => {
  const { user, updateAvatar, loading } = useAuth();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarUploadError, setAvatarUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setAvatarUploadError(null);
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarPreview(URL.createObjectURL(file));
    try {
      await updateAvatar(file);
      setAvatarUploadError(null);
    } catch (err) {
      setAvatarUploadError(err instanceof Error ? err.message : "Upload failed");
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };


  return (
    <div className={Styles.settingsPage}>
      <div className={Styles.sectionTitle}>My Profile</div>
      <div className={Styles.profileCard}>
        <div className={Styles.avatarArea} onClick={handleAvatarClick}>
          <img
            src={
              avatarPreview
                ? avatarPreview
                : user?.avatar
                ? user.avatar
                : "/profile-placeholder.png"
            }
            alt="User Avatar"
            className={Styles.avatarImg}
          />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleAvatarChange}
            disabled={loading}
          />
          <button className={Styles.avatarBtn} type="button">
            Change Photo
          </button>
        </div>
        <div className={Styles.profileDetails}>
          <div>
            <div className={Styles.label}>Username</div>
            <div className={Styles.value}>{user?.username || "--"}</div>
          </div>
          <div>
            <div className={Styles.label}>Email</div>
            <div className={Styles.value}>{user?.email || "--"}</div>
          </div>
        </div>
      </div>
      {avatarUploadError ? (
        <div className={Styles.error}>{avatarUploadError}</div>
      ) : null}

      <div className={Styles.sectionTitle}>Account Settings</div>
      <div className={Styles.accountCard}>
        <div>
          <div className={Styles.label}>Change Password</div>
          <button
            className={Styles.pseudoBtn}
            type="button"
            disabled
            title="Not implemented"
          >
            Change Password
          </button>
        </div>
        <div>
          <div className={Styles.label}>Registration Date</div>
          <div className={Styles.value}>
            {user?.createdAt
              ? new Date(user.createdAt).toLocaleDateString()
              : "--"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
