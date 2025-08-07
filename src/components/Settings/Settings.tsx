import { useRef, useState, useMemo } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useTrades } from "../../hooks/useTrade";
import Styles from "./settings.module.css";

const fmtC = (num: number, d: number = 0) =>
  typeof num === "number"
    ? "₹" + num.toLocaleString(undefined, { maximumFractionDigits: d })
    : "--";

const Settings = () => {
  const { user, updateAvatar, loading, changeUsername, changePassword } = useAuth();
  const { trades } = useTrades();

  // Avatar upload logic
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

  // Trade stats summary
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

  // Recent trades for table
  const recentTrades = useMemo(
    () =>
      (trades ?? [])
        .slice()
        .sort((a, b) => (a.date < b.date ? 1 : -1))
        .slice(0, 6),
    [trades]
  );

  // Change Username logic
  const [newUsername, setNewUsername] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [usernameSuccess, setUsernameSuccess] = useState("");

  // Change Password logic
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  return (
    <div className={Styles.performancePage}>
      <h1 className={Styles.pageTitle}>Account Settings</h1>

      <div className={Styles.cardGrid}>

        {/* Profile Card */}
        <div className={Styles.card}>
          <div className={Styles.cardHeader}>
            <h3>Profile Information</h3>
          </div>
          <div className={Styles.cardBody}>
            <div className={Styles.profileSection}>
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

        {/* Trade Stats Card */}
        <div className={Styles.card}>
          <div className={Styles.cardHeader}>
            <h3>Trading Summary</h3>
          </div>
          <div className={Styles.cardBody}>
            <div className={Styles.statsGrid}>
              <div className={Styles.statItem}>
                <span className={Styles.statLabel}>Total Trades</span>
                <span className={Styles.statValue}>{tradeStats.total}</span>
              </div>
              <div className={Styles.statItem}>
                <span className={Styles.statLabel}>Best Win</span>
                <span className={`${Styles.statValue} ${Styles.positive}`}>
                  {tradeStats.best?.pnl_amount !== undefined
                    ? fmtC(tradeStats.best.pnl_amount)
                    : "--"}
                </span>
              </div>
              <div className={Styles.statItem}>
                <span className={Styles.statLabel}>Worst Loss</span>
                <span className={`${Styles.statValue} ${Styles.negative}`}>
                  {tradeStats.worst?.pnl_amount !== undefined
                    ? fmtC(tradeStats.worst.pnl_amount)
                    : "--"}
                </span>
              </div>
              <div className={Styles.statItem}>
                <span className={Styles.statLabel}>Favorite Symbol</span>
                <span className={Styles.statValue}>{tradeStats.mostSymbol ?? "--"}</span>
              </div>
              <div className={Styles.statItem}>
                <span className={Styles.statLabel}>First Trade</span>
                <span className={Styles.statValueMini}>
                  {tradeStats.first
                    ? tradeStats.first.toLocaleDateString()
                    : "--"}
                </span>
              </div>
              <div className={Styles.statItem}>
                <span className={Styles.statLabel}>Last Trade</span>
                <span className={Styles.statValueMini}>
                  {tradeStats.last
                    ? tradeStats.last.toLocaleDateString()
                    : "--"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* --- Username Change Form --- */}
        <div className={Styles.card}>
          <div className={Styles.cardHeader}>
            <h3>Change Username</h3>
          </div>
          <div className={Styles.cardBody}>
            <form
              className={Styles.formRow}
              onSubmit={async e => {
                e.preventDefault();
                if (!newUsername.trim()) {
                  setUsernameError("Username cannot be empty");
                  return;
                }
                setUsernameError("");
                try {
                  await changeUsername(newUsername.trim());
                  setUsernameSuccess("Username updated!");
                  setTimeout(() => setUsernameSuccess(""), 1500);
                } catch (err) {
                  setUsernameError(err instanceof Error ? err.message : "Update failed");
                }
              }}
            >
              <input
                className={Styles.input}
                type="text"
                placeholder="New username"
                value={newUsername}
                onChange={e => setNewUsername(e.target.value)}
                disabled={loading}
                minLength={3}
                required
              />
              <button type="submit" className={Styles.primaryBtn} disabled={loading}>
                Update
              </button>
            </form>
            {usernameError && <div className={Styles.inputError}>{usernameError}</div>}
            {usernameSuccess && <div className={Styles.inputSuccess}>{usernameSuccess}</div>}
          </div>
        </div>

        {/* --- Password Change Form --- */}
        <div className={Styles.card}>
          <div className={Styles.cardHeader}>
            <h3>Change Password</h3>
          </div>
          <div className={Styles.cardBody}>
            <form
              className={Styles.formCol}
              onSubmit={async e => {
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
                  setCurrentPassword(""); setNewPassword(""); setConfirmPass("");
                  setTimeout(() => setPasswordSuccess(""), 1500);
                } catch (err) {
                  setPasswordError(err instanceof Error ? err.message : "Update failed");
                }
              }}
            >
              <input
                className={Styles.input}
                type="password"
                placeholder="Current password"
                autoComplete="current-password"
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                disabled={loading}
                required
              />
              <input
                className={Styles.input}
                type="password"
                placeholder="New password"
                autoComplete="new-password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                disabled={loading}
                required
                minLength={6}
              />
              <input
                className={Styles.input}
                type="password"
                placeholder="Confirm new password"
                autoComplete="new-password"
                value={confirmPass}
                onChange={e => setConfirmPass(e.target.value)}
                disabled={loading}
                required
                minLength={6}
              />
              <button type="submit" className={Styles.primaryBtn} disabled={loading}>
                Update
              </button>
            </form>
            {passwordError && <div className={Styles.inputError}>{passwordError}</div>}
            {passwordSuccess && <div className={Styles.inputSuccess}>{passwordSuccess}</div>}
          </div>
        </div>

        {/* Recent Trades Card */}
        <div className={`${Styles.card} ${Styles.wideCard}`}>
          <div className={Styles.cardHeader}>
            <h3>Recent Trades</h3>
          </div>
          <div className={Styles.cardBody}>
            {recentTrades.length > 0 ? (
              <div className={Styles.tableContainer}>
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
                            ? (t.pnl_amount >= 0 ? "+" : "") + fmtC(t.pnl_amount)
                            : "--"}
                        </td>
                        <td>{t.quantity !== undefined ? t.quantity : "--"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className={Styles.emptyState}>No trades found</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
