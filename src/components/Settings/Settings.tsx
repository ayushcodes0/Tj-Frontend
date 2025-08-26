import { useRef, useState, useMemo, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useTrades } from "../../hooks/useTrade";
import Styles from "./Settings.module.css";
import type { Trade } from "../../context/TradeContext";

interface TradeStats {
  total: number;
  best: Trade | null;
  worst: Trade | null;
  mostSymbol: string | null;
  first: Date | null;
  last: Date | null;
  totalProfit: number;
  winRate: number;
}

const formatCurrency = (num: number | undefined, decimals: number = 0) =>
  typeof num === "number"
    ? "₹" + num.toLocaleString(undefined, { maximumFractionDigits: decimals })
    : "--";

const Settings = () => {
  const { user, updateAvatar, loading, changeUsername, changePassword, logout } = useAuth();
  const { trades, fetchTrades } = useTrades();

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarUploadError, setAvatarUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [showUserModal, setShowUserModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  
  const [newUsername, setNewUsername] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [usernameSuccess, setUsernameSuccess] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  // Fetch all trades for lifetime when the component mounts
  useEffect(() => {
    fetchTrades("lifetime");
  }, [fetchTrades]);

  const tradeStats: TradeStats = useMemo(() => {
    if (!trades || !trades.length) {
      return {
        total: 0,
        best: null,
        worst: null,
        mostSymbol: null,
        first: null,
        last: null,
        totalProfit: 0,
        winRate: 0,
      };
    }

    // Find best and worst trades, handling potential null pnl
    const best = trades.reduce(
      (a: Trade, b: Trade) => ((b.pnl_amount ?? -Infinity) > (a.pnl_amount ?? -Infinity) ? b : a),
      trades[0]
    );
    const worst = trades.reduce(
      (a: Trade, b: Trade) => ((b.pnl_amount ?? Infinity) < (a.pnl_amount ?? Infinity) ? b : a),
      trades[0]
    );

    // Count symbol occurrences
    const symCount: Record<string, number> = {};
    trades.forEach(t => {
      if (t.symbol) {
        symCount[t.symbol] = (symCount[t.symbol] ?? 0) + 1;
      }
    });

    const mostSymbol = Object.entries(symCount).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

    // Get first and last trade dates
    const sortedDates = trades
      .map(t => t.date)
      .sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

    const first = sortedDates.length > 0 ? new Date(sortedDates[0]) : null;
    const last = sortedDates.length > 0 ? new Date(sortedDates[sortedDates.length - 1]) : null;
    
    // Calculate total profit
    const totalProfit = trades.reduce((sum, trade) => sum + (trade.pnl_amount || 0), 0);
    
    // Calculate win rate
    const winningTrades = trades.filter(trade => (trade.pnl_amount || 0) > 0).length;
    const winRate = trades.length > 0 ? (winningTrades / trades.length) * 100 : 0;

    return {
      total: trades.length,
      best,
      worst,
      mostSymbol,
      first,
      last,
      totalProfit,
      winRate,
    };
  }, [trades]);

  const getInitials = (username: string | undefined): string => {
    if (!username) return "";
    const parts = username.split(" ");
    if (parts.length > 1) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return username.substring(0, 2).toUpperCase();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setAvatarUploadError(null);
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setAvatarUploadError("File size must be less than 5MB");
      return;
    }
    
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
      setTimeout(() => {
        setUsernameSuccess("");
        setShowUserModal(false);
      }, 1500);
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
      setTimeout(() => {
        setPasswordSuccess("");
        setShowPasswordModal(false);
      }, 1500);
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : "Update failed");
    }
  };

  const displayAvatar = user?.avatar || avatarPreview;

  return (
    <div className={Styles.settingsContainer}>
      <div className={Styles.header}>
        <h1 className={Styles.pageTitle}>Settings</h1>
        <p className={Styles.pageSubtitle}>Manage your account settings and preferences</p>
      </div>

      <div className={Styles.content}>
        <div className={Styles.settingsGrid}>
          {/* Profile Section */}
          <div className={Styles.settingsCard}>
            <div className={Styles.cardHeader}>
              <h2>Profile Information</h2>
            </div>
            <div className={Styles.cardBody}>
              <div className={Styles.avatarSection}>
                <div className={Styles.avatarContainer} onClick={handleAvatarClick}>
                  {displayAvatar ? (
                    <img
                      src={displayAvatar}
                      alt="User Avatar"
                      className={Styles.avatarImg}
                    />
                  ) : (
                    <div className={Styles.avatarInitials}>
                      {getInitials(user?.username)}
                    </div>
                  )}
                  <div className={Styles.avatarOverlay}>
                    <span>Change</span>
                  </div>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleAvatarChange}
                  disabled={loading}
                />
                {avatarUploadError && (
                  <div className={Styles.error}>{avatarUploadError}</div>
                )}
                <p className={Styles.avatarHint}>Click to upload a new photo. Max size 5MB.</p>
              </div>
              
              <div className={Styles.profileDetails}>
                <div className={Styles.detailRow}>
                  <div className={Styles.detailLabel}>Username</div>
                  <div className={Styles.detailValue}>{user?.username || "--"}</div>
                  <button 
                    className={Styles.editButton}
                    onClick={() => setShowUserModal(true)}
                  >
                    ⋮
                  </button>
                </div>
                <div className={Styles.detailRow}>
                  <div className={Styles.detailLabel}>Email</div>
                  <div className={Styles.detailValue}>{user?.email || "--"}</div>
                </div>
                <div className={Styles.detailRow}>
                  <div className={Styles.detailLabel}>Member Since</div>
                  <div className={Styles.detailValue}>
                    {user?.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : "--"}
                  </div>
                </div>
                <div className={Styles.detailRow}>
                  <div className={Styles.detailLabel}>Subscription</div>
                  <div className={Styles.detailValue}>
                    <span className={Styles.subscriptionBadge}>
                      {user?.subscription?.plan || "Free"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Security Section */}
          <div className={Styles.settingsCard}>
            <div className={Styles.cardHeader}>
              <h2>Security</h2>
            </div>
            <div className={Styles.cardBody}>
              <div className={Styles.securityOptions}>
                <div className={Styles.securityOption}>
                  <div className={Styles.optionInfo}>
                    <h3>Change Password</h3>
                    <p>Update your password to keep your account secure</p>
                  </div>
                  <button 
                    className={Styles.optionButton}
                    onClick={() => setShowPasswordModal(true)}
                  >
                    Change
                  </button>
                </div>
                
                <div className={Styles.securityOption}>
                  <div className={Styles.optionInfo}>
                    <h3>Session Management</h3>
                    <p>Manage your active sessions</p>
                  </div>
                  <button className={Styles.optionButton} onClick={logout}>
                    Logout All
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Trading Stats Section */}
          <div className={Styles.settingsCard}>
            <div className={Styles.cardHeader}>
              <h2>Trading Statistics</h2>
            </div>
            <div className={Styles.cardBody}>
              <div className={Styles.statsOverview}>
                <div className={Styles.statItem}>
                  <div className={Styles.statIcon}>📈</div>
                  <div className={Styles.statContent}>
                    <div className={Styles.statNumber}>{tradeStats.total}</div>
                    <div className={Styles.statLabel}>Total Trades</div>
                  </div>
                </div>
                <div className={Styles.statItem}>
                  <div className={Styles.statIcon}>💰</div>
                  <div className={Styles.statContent}>
                    <div className={Styles.statNumber}>{formatCurrency(tradeStats.totalProfit)}</div>
                    <div className={Styles.statLabel}>Total Profit</div>
                  </div>
                </div>
                <div className={Styles.statItem}>
                  <div className={Styles.statIcon}>🎯</div>
                  <div className={Styles.statContent}>
                    <div className={Styles.statNumber}>{tradeStats.winRate.toFixed(1)}%</div>
                    <div className={Styles.statLabel}>Win Rate</div>
                  </div>
                </div>
                <div className={Styles.statItem}>
                  <div className={Styles.statIcon}>📊</div>
                  <div className={Styles.statContent}>
                    <div className={Styles.statNumber}>{tradeStats.mostSymbol || "--"}</div>
                    <div className={Styles.statLabel}>Most Traded</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Account Management Section */}
          <div className={Styles.settingsCard}>
            <div className={Styles.cardHeader}>
              <h2>Account Management</h2>
            </div>
            <div className={Styles.cardBody}>
              <div className={Styles.accountActions}>
                <div className={Styles.accountAction}>
                  <h3>Export Data</h3>
                  <p>Download a copy of your trading data</p>
                  <button className={Styles.secondaryButton}>Export Data</button>
                </div>
                
                <div className={Styles.accountAction}>
                  <h3>Delete Account</h3>
                  <p>Permanently delete your account and all data</p>
                  <button className={Styles.dangerButton}>Delete Account</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Username Change Modal */}
      {showUserModal && (
        <div className={Styles.modalOverlay}>
          <div className={Styles.modal}>
            <div className={Styles.modalHeader}>
              <h2>Change Username</h2>
              <button 
                className={Styles.closeButton}
                onClick={() => setShowUserModal(false)}
              >
                &times;
              </button>
            </div>
            <div className={Styles.modalBody}>
              <form onSubmit={handleUsernameSubmit} className={Styles.form}>
                <div className={Styles.formGroup}>
                  <label className={Styles.formLabel}>Current Username</label>
                  <div className={Styles.currentValue}>{user?.username || "--"}</div>
                </div>
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
                <div className={Styles.modalActions}>
                  <button 
                    type="button" 
                    className={Styles.secondaryButton}
                    onClick={() => setShowUserModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className={Styles.primaryButton} disabled={loading}>
                    Update Username
                  </button>
                </div>
                {usernameError && <div className={Styles.errorMessage}>{usernameError}</div>}
                {usernameSuccess && <div className={Styles.successMessage}>{usernameSuccess}</div>}
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className={Styles.modalOverlay}>
          <div className={Styles.modal}>
            <div className={Styles.modalHeader}>
              <h2>Change Password</h2>
              <button 
                className={Styles.closeButton}
                onClick={() => setShowPasswordModal(false)}
              >
                &times;
              </button>
            </div>
            <div className={Styles.modalBody}>
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
                <div className={Styles.modalActions}>
                  <button 
                    type="button" 
                    className={Styles.secondaryButton}
                    onClick={() => setShowPasswordModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className={Styles.primaryButton} disabled={loading}>
                    Update Password
                  </button>
                </div>
                {passwordError && <div className={Styles.errorMessage}>{passwordError}</div>}
                {passwordSuccess && <div className={Styles.successMessage}>{passwordSuccess}</div>}
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;