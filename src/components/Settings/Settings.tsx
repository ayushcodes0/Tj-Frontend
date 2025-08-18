import { useRef, useState, useMemo } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useTrades } from "../../hooks/useTrade";
import Styles from "./settings.module.css";

const formatCurrency = (num: number, decimals: number = 0) =>
  typeof num === "number"
    ? "₹" + num.toLocaleString(undefined, { maximumFractionDigits: decimals })
    : "--";

const Settings = () => {
  const { user, updateAvatar, loading, changeUsername, changePassword } = useAuth();
  const { trades } = useTrades();

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarUploadError, setAvatarUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [newUsername, setNewUsername] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [usernameSuccess, setUsernameSuccess] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  const tradeStats = useMemo(() => {
    if (!trades || !trades.length)
      return {
        total: 0,
        best: null,
        worst: null,
        mostSymbol: null,
        first: null,
        last: null,
      };
    
    const best = trades.reduce((a, b) => ((b.pnl_amount ?? -Infinity) > (a.pnl_amount ?? -Infinity) ? b : a), trades[0]);
    const worst = trades.reduce((a, b) => ((b.pnl_amount ?? Infinity) < (a.pnl_amount ?? Infinity) ? b : a), trades[0]);
    
    const symCount: Record<string, number> = {};
    trades.forEach(t => {
      symCount[t.symbol] = (symCount[t.symbol] ?? 0) + 1;
    });
    const mostSymbol = Object.entries(symCount).sort((a, b) => b[1] - a[1])[0]?.[0];

    const sortedDates = trades
      .map(t => t.date)
      .sort((a, b) => (a > b ? 1 : -1));
    const first = sortedDates[0] ? new Date(sortedDates[0]) : null;
    const last = sortedDates[sortedDates.length - 1] ? new Date(sortedDates[sortedDates.length - 1]) : null;

    return {
      total: trades.length,
      best,
      worst,
      mostSymbol,
      first,
      last,
    };
  }, [trades]);

  const recentTrades = useMemo(
    () =>
      (trades ?? [])
        .slice()
        .sort((a, b) => (a.date < b.date ? 1 : -1))
        .slice(0, 6),
    [trades]
  );

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

  const handleUsernameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername.trim()) {
      setUsernameError("Username cannot be empty");
      return;
    }
    setUsernameError("");
    try {
      await changeUsername(newUsername.trim());
      setUsernameSuccess("Username updated!");
      setNewUsername("");
      setTimeout(() => setUsernameSuccess(""), 1500);
    } catch (err) {
      setUsernameError(err instanceof Error ? err.message : "Update failed");
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");
    if (!currentPassword || !newPassword) {
      setPasswordError("All fields required");
      return;
    }
    if (newPassword !== confirmPass) {
      setPasswordError("Passwords do not match");
      return;
    }
    try {
      await changePassword(currentPassword, newPassword);
      setPasswordSuccess("Password updated!");
      setCurrentPassword(""); 
      setNewPassword(""); 
      setConfirmPass("");
      setTimeout(() => setPasswordSuccess(""), 1500);
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : "Update failed");
    }
  };

  return (
    <div className={Styles.dashboard}>
      <header className={Styles.header}>
        <h1 className={Styles.title}>Account Settings</h1>
        <div className={Styles.summaryCards}>
          <div className={`${Styles.summaryCard} ${Styles.primaryCard}`}>
            <div className={Styles.summaryLabel}>Total Trades</div>
            <div className={Styles.summaryValue}>{tradeStats.total}</div>
          </div>
          <div className={`${Styles.summaryCard} ${Styles.successCard}`}>
            <div className={Styles.summaryLabel}>Best Trade</div>
            <div className={Styles.summaryValue}>
              {tradeStats.best?.pnl_amount ? formatCurrency(tradeStats.best.pnl_amount) : "--"}
            </div>
          </div>
          <div className={`${Styles.summaryCard} ${Styles.dangerCard}`}>
            <div className={Styles.summaryLabel}>Worst Trade</div>
            <div className={Styles.summaryValue}>
              {tradeStats.worst?.pnl_amount ? formatCurrency(tradeStats.worst.pnl_amount) : "--"}
            </div>
          </div>
        </div>
      </header>

      <section className={Styles.section}>
        <h2 className={Styles.sectionTitle}>Profile Information</h2>
        <div className={Styles.doubleColumn}>
          <div className={Styles.dataCard}>
            <div className={Styles.dataHeader}>
              <h3>Personal Details</h3>
            </div>
            <div className={Styles.dataBody}>
              <div className={Styles.profileContainer}>
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
                  {avatarUploadError && (
                    <div className={Styles.error}>{avatarUploadError}</div>
                  )}
                </div>
                <div className={Styles.profileDetails}>
                  <div className={Styles.profileField}>
                    <span className={Styles.profileLabel}>Username</span>
                    <span className={Styles.profileValue}>{user?.username || "--"}</span>
                  </div>
                  <div className={Styles.profileField}>
                    <span className={Styles.profileLabel}>Email</span>
                    <span className={Styles.profileValue}>{user?.email || "--"}</span>
                  </div>
                  <div className={Styles.profileField}>
                    <span className={Styles.profileLabel}>Member Since</span>
                    <span className={Styles.profileValue}>
                      {user?.createdAt
                        ? new Date(user.createdAt).toLocaleDateString()
                        : "--"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={Styles.dataCard}>
            <div className={Styles.dataHeader}>
              <h3>Trading Summary</h3>
            </div>
            <div className={Styles.dataBody}>
              <table className={Styles.dataTable}>
                <tbody>
                  <tr>
                    <td>Total Trades</td>
                    <td>{tradeStats.total}</td>
                  </tr>
                  <tr>
                    <td>Best Trade</td>
                    <td className={Styles.positive}>
                      {tradeStats.best?.pnl_amount !== undefined
                        ? formatCurrency(tradeStats.best.pnl_amount)
                        : "--"}
                    </td>
                  </tr>
                  <tr>
                    <td>Worst Trade</td>
                    <td className={Styles.negative}>
                      {tradeStats.worst?.pnl_amount !== undefined
                        ? formatCurrency(tradeStats.worst.pnl_amount)
                        : "--"}
                    </td>
                  </tr>
                  <tr>
                    <td>Favorite Symbol</td>
                    <td>{tradeStats.mostSymbol ?? "--"}</td>
                  </tr>
                  <tr>
                    <td>First Trade</td>
                    <td>
                      {tradeStats.first
                        ? tradeStats.first.toLocaleDateString()
                        : "--"}
                    </td>
                  </tr>
                  <tr>
                    <td>Last Trade</td>
                    <td>
                      {tradeStats.last
                        ? tradeStats.last.toLocaleDateString()
                        : "--"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section className={Styles.section}>
        <h2 className={Styles.sectionTitle}>Account Security</h2>
        <div className={Styles.doubleColumn}>
          <div className={Styles.dataCard}>
            <div className={Styles.dataHeader}>
              <h3>Change Username</h3>
            </div>
            <div className={Styles.dataBody}>
              <form onSubmit={handleUsernameSubmit} className={Styles.form}>
                <div className={Styles.formGroup}>
                  <label className={Styles.formLabel}>New Username</label>
                  <input
                    className={Styles.formInput}
                    type="text"
                    placeholder="Enter new username"
                    value={newUsername}
                    onChange={e => setNewUsername(e.target.value)}
                    disabled={loading}
                    minLength={3}
                    required
                  />
                </div>
                <button type="submit" className={Styles.primaryButton} disabled={loading}>
                  Update Username
                </button>
                {usernameError && <div className={Styles.errorMessage}>{usernameError}</div>}
                {usernameSuccess && <div className={Styles.successMessage}>{usernameSuccess}</div>}
              </form>
            </div>
          </div>

          <div className={Styles.dataCard}>
            <div className={Styles.dataHeader}>
              <h3>Change Password</h3>
            </div>
            <div className={Styles.dataBody}>
              <form onSubmit={handlePasswordSubmit} className={Styles.form}>
                <div className={Styles.formGroup}>
                  <label className={Styles.formLabel}>Current Password</label>
                  <input
                    className={Styles.formInput}
                    type="password"
                    placeholder="Current password"
                    autoComplete="current-password"
                    value={currentPassword}
                    onChange={e => setCurrentPassword(e.target.value)}
                    disabled={loading}
                    required
                  />
                </div>
                <div className={Styles.formGroup}>
                  <label className={Styles.formLabel}>New Password</label>
                  <input
                    className={Styles.formInput}
                    type="password"
                    placeholder="New password"
                    autoComplete="new-password"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    disabled={loading}
                    required
                    minLength={6}
                  />
                </div>
                <div className={Styles.formGroup}>
                  <label className={Styles.formLabel}>Confirm Password</label>
                  <input
                    className={Styles.formInput}
                    type="password"
                    placeholder="Confirm new password"
                    autoComplete="new-password"
                    value={confirmPass}
                    onChange={e => setConfirmPass(e.target.value)}
                    disabled={loading}
                    required
                    minLength={6}
                  />
                </div>
                <button type="submit" className={Styles.primaryButton} disabled={loading}>
                  Update Password
                </button>
                {passwordError && <div className={Styles.errorMessage}>{passwordError}</div>}
                {passwordSuccess && <div className={Styles.successMessage}>{passwordSuccess}</div>}
              </form>
            </div>
          </div>
        </div>
      </section>

      <section className={Styles.section}>
        <h2 className={Styles.sectionTitle}>Recent Trades</h2>
        <div className={Styles.fullWidthCard}>
          <div className={Styles.dataHeader}>
            <h3>Last 6 Trades</h3>
          </div>
          <div className={Styles.dataBody}>
            {recentTrades.length > 0 ? (
              <table className={Styles.dataTable}>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Symbol</th>
                    <th>Direction</th>
                    <th>P&L</th>
                    <th>Qty</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTrades.map((t) => (
                    <tr key={t._id}>
                      <td>{new Date(t.date).toLocaleDateString()}</td>
                      <td>{t.symbol}</td>
                      <td>
                        <span className={
                          t.direction === "Long"
                            ? Styles.long
                            : Styles.short
                        }>
                          {t.direction}
                        </span>
                      </td>
                      <td className={
                        (t.pnl_amount ?? 0) >= 0
                          ? Styles.positive
                          : Styles.negative
                      }>
                        {typeof t.pnl_amount === "number"
                          ? (t.pnl_amount >= 0 ? "+" : "") + formatCurrency(t.pnl_amount)
                          : "--"}
                      </td>
                      <td>{t.quantity !== undefined ? t.quantity : "--"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className={Styles.emptyState}>No trades found</div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Settings;