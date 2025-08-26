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
  currentStreak: number;
  maxStreak: number;
}

const formatCurrency = (num: number | undefined, decimals: number = 0) =>
  typeof num === "number"
    ? "₹" + num.toLocaleString(undefined, { maximumFractionDigits: decimals })
    : "--";

const Settings = () => {
  const { user, updateAvatar, loading, changeUsername, changePassword } = useAuth();
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
        currentStreak: 0,
        maxStreak: 0
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

    // Calculate streaks
    let currentStreak = 0;
    let maxStreak = 0;
    let tempStreak = 0;
    
    // Sort trades by date to calculate streaks correctly
    const sortedTrades = [...trades].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    sortedTrades.forEach(trade => {
      if ((trade.pnl_amount || 0) > 0) {
        tempStreak++;
        currentStreak = tempStreak;
        if (tempStreak > maxStreak) {
          maxStreak = tempStreak;
        }
      } else {
        tempStreak = 0;
      }
    });

    return {
      total: trades.length,
      best,
      worst,
      mostSymbol,
      first,
      last,
      totalProfit,
      winRate,
      currentStreak,
      maxStreak
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
        <div className={Styles.mainContent}>
          {/* Profile Section */}
          <div className={Styles.sectionCard}>
            <div className={Styles.sectionHeader}>
              <h2>Profile Information</h2>
              <p>Manage your personal information and how others see you on the platform</p>
            </div>
            <div className={Styles.sectionBody}>
              <div className={Styles.profileGrid}>
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
                  <p className={Styles.avatarHint}>JPG, PNG. Max size 5MB.</p>
                </div>
                
                <div className={Styles.profileDetails}>
                  <div className={Styles.detailItem}>
                    <label className={Styles.detailLabel}>Username</label>
                    <div className={Styles.detailValue}>{user?.username || "--"}</div>
                    <button 
                      className={Styles.editFieldButton}
                      onClick={() => setShowUserModal(true)}
                    >
                      Edit
                    </button>
                  </div>
                  <div className={Styles.detailItem}>
                    <label className={Styles.detailLabel}>Email</label>
                    <div className={Styles.detailValue}>{user?.email || "--"}</div>
                  </div>
                  <div className={Styles.detailItem}>
                    <label className={Styles.detailLabel}>Member Since</label>
                    <div className={Styles.detailValue}>
                      {user?.createdAt
                        ? new Date(user.createdAt).toLocaleDateString()
                        : "--"}
                    </div>
                  </div>
                  <div className={Styles.detailItem}>
                    <label className={Styles.detailLabel}>Subscription</label>
                    <div className={Styles.detailValue}>
                      <span className={Styles.subscriptionBadge}>
                        {user?.subscription?.plan || "Free"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Security Section */}
          <div className={Styles.sectionCard}>
            <div className={Styles.sectionHeader}>
              <h2>Security</h2>
              <p>Manage your password and account security settings</p>
            </div>
            <div className={Styles.sectionBody}>
              <div className={Styles.securityGrid}>
                <div className={Styles.securityItem}>
                  <div className={Styles.securityIcon}>🔒</div>
                  <div className={Styles.securityInfo}>
                    <h3>Password</h3>
                    <p>Last changed: 2 months ago</p>
                  </div>
                  <button 
                    className={Styles.primaryButton}
                    onClick={() => setShowPasswordModal(true)}
                  >
                    Update
                  </button>
                </div>
                
                <div className={Styles.securityItem}>
                  <div className={Styles.securityIcon}>📱</div>
                  <div className={Styles.securityInfo}>
                    <h3>Two-Factor Authentication</h3>
                    <p>Add an extra layer of security to your account</p>
                  </div>
                  <button className={Styles.secondaryButton}>
                    Enable
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Trading Stats Section */}
          <div className={Styles.sectionCard}>
            <div className={Styles.sectionHeader}>
              <h2>Trading Statistics</h2>
              <p>Your overall trading performance summary</p>
            </div>
            <div className={Styles.sectionBody}>
              <div className={Styles.statsGrid}>
                <div className={Styles.statCard}>
                  <div className={Styles.statHeader}>
                    <div className={Styles.statIcon}>📈</div>
                    <h3>Total Trades</h3>
                  </div>
                  <div className={Styles.statValue}>{tradeStats.total}</div>
                </div>
                
                <div className={Styles.statCard}>
                  <div className={Styles.statHeader}>
                    <div className={Styles.statIcon}>💰</div>
                    <h3>Total Profit</h3>
                  </div>
                  <div className={Styles.statValue}>{formatCurrency(tradeStats.totalProfit)}</div>
                </div>
                
                <div className={Styles.statCard}>
                  <div className={Styles.statHeader}>
                    <div className={Styles.statIcon}>🎯</div>
                    <h3>Win Rate</h3>
                  </div>
                  <div className={Styles.statValue}>{tradeStats.winRate.toFixed(1)}%</div>
                </div>
                
                <div className={Styles.statCard}>
                  <div className={Styles.statHeader}>
                    <div className={Styles.statIcon}>📊</div>
                    <h3>Most Traded</h3>
                  </div>
                  <div className={Styles.statValue}>{tradeStats.mostSymbol || "--"}</div>
                </div>

                <div className={Styles.statCard}>
                  <div className={Styles.statHeader}>
                    <div className={Styles.statIcon}>🔥</div>
                    <h3>Current Streak</h3>
                  </div>
                  <div className={Styles.statValue}>{tradeStats.currentStreak}</div>
                </div>

                <div className={Styles.statCard}>
                  <div className={Styles.statHeader}>
                    <div className={Styles.statIcon}>🏆</div>
                    <h3>Max Streak</h3>
                  </div>
                  <div className={Styles.statValue}>{tradeStats.maxStreak}</div>
                </div>
              </div>
              
              <div className={Styles.advancedStats}>
                <h3>Performance Highlights</h3>
                <div className={Styles.highlightsGrid}>
                  <div className={Styles.highlightItem}>
                    <span className={Styles.highlightLabel}>Best Trade</span>
                    <span className={Styles.highlightValue}>
                      {tradeStats.best ? formatCurrency(tradeStats.best.pnl_amount) : "--"}
                    </span>
                  </div>
                  <div className={Styles.highlightItem}>
                    <span className={Styles.highlightLabel}>Worst Trade</span>
                    <span className={Styles.highlightValue}>
                      {tradeStats.worst ? formatCurrency(tradeStats.worst.pnl_amount) : "--"}
                    </span>
                  </div>
                  <div className={Styles.highlightItem}>
                    <span className={Styles.highlightLabel}>First Trade</span>
                    <span className={Styles.highlightValue}>
                      {tradeStats.first ? tradeStats.first.toLocaleDateString() : "--"}
                    </span>
                  </div>
                  <div className={Styles.highlightItem}>
                    <span className={Styles.highlightLabel}>Last Trade</span>
                    <span className={Styles.highlightValue}>
                      {tradeStats.last ? tradeStats.last.toLocaleDateString() : "--"}
                    </span>
                  </div>
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