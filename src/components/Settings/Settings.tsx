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

  const [activeTab, setActiveTab] = useState("profile");
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

  const recentTrades = useMemo(
    () =>
      (trades ?? [])
        .slice()
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 6),
    [trades]
  );

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

  const displayAvatar = user?.avatar || avatarPreview;

  return (
    <div className={Styles.settingsContainer}>
      <div className={Styles.topNav}>
        <h1 className={Styles.pageTitle}>Settings</h1>
        <nav className={Styles.navTabs}>
          <button 
            className={`${Styles.navTab} ${activeTab === "profile" ? Styles.active : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            <span className={Styles.navIcon}>👤</span>
            Profile
          </button>
          <button 
            className={`${Styles.navTab} ${activeTab === "security" ? Styles.active : ""}`}
            onClick={() => setActiveTab("security")}
          >
            <span className={Styles.navIcon}>🔒</span>
            Security
          </button>
          <button 
            className={`${Styles.navTab} ${activeTab === "trading" ? Styles.active : ""}`}
            onClick={() => setActiveTab("trading")}
          >
            <span className={Styles.navIcon}>📊</span>
            Trading Stats
          </button>
          <button 
            className={`${Styles.navTab} ${activeTab === "preferences" ? Styles.active : ""}`}
            onClick={() => setActiveTab("preferences")}
          >
            <span className={Styles.navIcon}>⚙️</span>
            Preferences
          </button>
          <button 
            className={`${Styles.navTab} ${activeTab === "legal" ? Styles.active : ""}`}
            onClick={() => setActiveTab("legal")}
          >
            <span className={Styles.navIcon}>📝</span>
            Legal
          </button>
          <button 
            className={Styles.navTab}
            onClick={logout}
          >
            <span className={Styles.navIcon}>🚪</span>
            Logout
          </button>
        </nav>
      </div>

      <div className={Styles.content}>
        {activeTab === "profile" && (
          <div className={Styles.tabContent}>
            <h2 className={Styles.tabTitle}>Profile Information</h2>
            
            <div className={Styles.profileCard}>
              <div className={Styles.profileHeader}>
                <h3>Personal Details</h3>
                <p>Manage your personal information</p>
              </div>
              
              <div className={Styles.profileBody}>
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
                  <p className={Styles.avatarHint}>Click on the avatar to upload a new photo. Max size 5MB.</p>
                </div>
                
                <div className={Styles.profileDetails}>
                  <div className={Styles.detailRow}>
                    <div className={Styles.detailLabel}>Username</div>
                    <div className={Styles.detailValue}>{user?.username || "--"}</div>
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
            
            <div className={Styles.statsCard}>
              <div className={Styles.statsHeader}>
                <h3>Quick Stats</h3>
              </div>
              <div className={Styles.statsGrid}>
                <div className={Styles.statItem}>
                  <div className={Styles.statValue}>{tradeStats.total}</div>
                  <div className={Styles.statLabel}>Total Trades</div>
                </div>
                <div className={Styles.statItem}>
                  <div className={Styles.statValue}>{formatCurrency(tradeStats.totalProfit)}</div>
                  <div className={Styles.statLabel}>Total P&L</div>
                </div>
                <div className={Styles.statItem}>
                  <div className={Styles.statValue}>{tradeStats.winRate.toFixed(1)}%</div>
                  <div className={Styles.statLabel}>Win Rate</div>
                </div>
                <div className={Styles.statItem}>
                  <div className={Styles.statValue}>{tradeStats.mostSymbol || "--"}</div>
                  <div className={Styles.statLabel}>Most Traded</div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === "security" && (
          <div className={Styles.tabContent}>
            <h2 className={Styles.tabTitle}>Security Settings</h2>
            
            <div className={Styles.securityCard}>
              <div className={Styles.cardHeader}>
                <h3>Change Username</h3>
                <p>Update your username</p>
              </div>
              <div className={Styles.cardBody}>
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
                  <button type="submit" className={Styles.primaryButton} disabled={loading}>
                    Update Username
                  </button>
                  {usernameError && <div className={Styles.errorMessage}>{usernameError}</div>}
                  {usernameSuccess && <div className={Styles.successMessage}>{usernameSuccess}</div>}
                </form>
              </div>
            </div>
            
            <div className={Styles.securityCard}>
              <div className={Styles.cardHeader}>
                <h3>Change Password</h3>
                <p>Update your password to keep your account secure</p>
              </div>
              <div className={Styles.cardBody}>
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
            
            <div className={Styles.securityCard}>
              <div className={Styles.cardHeader}>
                <h3>Session Management</h3>
                <p>Manage your active sessions</p>
              </div>
              <div className={Styles.cardBody}>
                <div className={Styles.sessionInfo}>
                  <p>Current session active since: {new Date().toLocaleString()}</p>
                </div>
                <button className={Styles.secondaryButton} onClick={logout}>
                  Logout from all devices
                </button>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === "trading" && (
          <div className={Styles.tabContent}>
            <h2 className={Styles.tabTitle}>Trading Statistics</h2>
            
            <div className={Styles.statsOverview}>
              <div className={`${Styles.statCard} ${Styles.primaryStat}`}>
                <div className={Styles.statIcon}>📈</div>
                <div className={Styles.statContent}>
                  <div className={Styles.statNumber}>{tradeStats.total}</div>
                  <div className={Styles.statTitle}>Total Trades</div>
                </div>
              </div>
              <div className={`${Styles.statCard} ${Styles.successStat}`}>
                <div className={Styles.statIcon}>💰</div>
                <div className={Styles.statContent}>
                  <div className={Styles.statNumber}>{formatCurrency(tradeStats.totalProfit)}</div>
                  <div className={Styles.statTitle}>Total Profit</div>
                </div>
              </div>
              <div className={`${Styles.statCard} ${Styles.infoStat}`}>
                <div className={Styles.statIcon}>🎯</div>
                <div className={Styles.statContent}>
                  <div className={Styles.statNumber}>{tradeStats.winRate.toFixed(1)}%</div>
                  <div className={Styles.statTitle}>Win Rate</div>
                </div>
              </div>
            </div>
            
            <div className={Styles.doubleColumn}>
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
              
              <div className={Styles.dataCard}>
                <div className={Styles.dataHeader}>
                  <h3>Recent Trades</h3>
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
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className={Styles.emptyState}>No trades found</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === "preferences" && (
          <div className={Styles.tabContent}>
            <h2 className={Styles.tabTitle}>Preferences</h2>
            
            <div className={Styles.preferenceCard}>
              <div className={Styles.cardHeader}>
                <h3>Notification Settings</h3>
                <p>Manage how we notify you</p>
              </div>
              <div className={Styles.cardBody}>
                <div className={Styles.preferenceItem}>
                  <div className={Styles.preferenceInfo}>
                    <h4>Email Notifications</h4>
                    <p>Receive emails about your account activity</p>
                  </div>
                  <label className={Styles.toggleSwitch}>
                    <input type="checkbox" defaultChecked />
                    <span className={Styles.slider}></span>
                  </label>
                </div>
                
                <div className={Styles.preferenceItem}>
                  <div className={Styles.preferenceInfo}>
                    <h4>Trade Alerts</h4>
                    <p>Get notified when your trades hit targets</p>
                  </div>
                  <label className={Styles.toggleSwitch}>
                    <input type="checkbox" defaultChecked />
                    <span className={Styles.slider}></span>
                  </label>
                </div>
                
                <div className={Styles.preferenceItem}>
                  <div className={Styles.preferenceInfo}>
                    <h4>Market Updates</h4>
                    <p>Receive market news and updates</p>
                  </div>
                  <label className={Styles.toggleSwitch}>
                    <input type="checkbox" />
                    <span className={Styles.slider}></span>
                  </label>
                </div>
              </div>
            </div>
            
            <div className={Styles.preferenceCard}>
              <div className={Styles.cardHeader}>
                <h3>Display Preferences</h3>
                <p>Customize how content appears</p>
              </div>
              <div className={Styles.cardBody}>
                <div className={Styles.formGroup}>
                  <label className={Styles.formLabel}>Theme</label>
                  <select className={Styles.formSelect} defaultValue="light">
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="auto">Auto (System)</option>
                  </select>
                </div>
                
                <div className={Styles.formGroup}>
                  <label className={Styles.formLabel}>Dashboard View</label>
                  <select className={Styles.formSelect} defaultValue="standard">
                    <option value="standard">Standard</option>
                    <option value="compact">Compact</option>
                    <option value="detailed">Detailed</option>
                  </select>
                </div>
                
                <div className={Styles.formGroup}>
                  <label className={Styles.formLabel}>Default Time Range</label>
                  <select className={Styles.formSelect} defaultValue="month">
                    <option value="week">Last Week</option>
                    <option value="month">Last Month</option>
                    <option value="quarter">Last Quarter</option>
                    <option value="year">Last Year</option>
                    <option value="all">All Time</option>
                  </select>
                </div>
                
                <button className={Styles.primaryButton}>
                  Save Preferences
                </button>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === "legal" && (
          <div className={Styles.tabContent}>
            <h2 className={Styles.tabTitle}>Legal</h2>
            
            <div className={Styles.legalCard}>
              <div className={Styles.cardHeader}>
                <h3>Terms & Policies</h3>
                <p>Review our terms and policies</p>
              </div>
              <div className={Styles.cardBody}>
                <div className={Styles.legalLinks}>
                  <a href="/terms-of-service" className={Styles.legalLink}>
                    <div className={Styles.legalLinkIcon}>📄</div>
                    <div className={Styles.legalLinkContent}>
                      <h4>Terms of Service</h4>
                      <p>Our terms and conditions for using the platform</p>
                    </div>
                  </a>
                  
                  <a href="/privacy-policy" className={Styles.legalLink}>
                    <div className={Styles.legalLinkIcon}>🔒</div>
                    <div className={Styles.legalLinkContent}>
                      <h4>Privacy Policy</h4>
                      <p>How we collect, use, and protect your data</p>
                    </div>
                  </a>
                  
                  <a href="/disclaimer" className={Styles.legalLink}>
                    <div className={Styles.legalLinkIcon}>⚠️</div>
                    <div className={Styles.legalLinkContent}>
                      <h4>Disclaimer</h4>
                      <p>Important information about trading risks</p>
                    </div>
                  </a>
                  
                  <a href="/data-processing" className={Styles.legalLink}>
                    <div className={Styles.legalLinkIcon}>📊</div>
                    <div className={Styles.legalLinkContent}>
                      <h4>Data Processing Agreement</h4>
                      <p>How we process and handle your data</p>
                    </div>
                  </a>
                </div>
              </div>
            </div>
            
            <div className={Styles.legalCard}>
              <div className={Styles.cardHeader}>
                <h3>Account Management</h3>
                <p>Manage your account data</p>
              </div>
              <div className={Styles.cardBody}>
                <div className={Styles.accountActions}>
                  <div className={Styles.accountAction}>
                    <h4>Export Data</h4>
                    <p>Download a copy of your trading data</p>
                    <button className={Styles.secondaryButton}>Export Data</button>
                  </div>
                  
                  <div className={Styles.accountAction}>
                    <h4>Delete Account</h4>
                    <p>Permanently delete your account and all data</p>
                    <button className={Styles.dangerButton}>Delete Account</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;