import { useRef, useState, useMemo, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useTrades } from "../../hooks/useTrade";
import { useCustomToast } from "../../hooks/useCustomToast"; // Add this import
import Styles from "./Settings.module.css";
import type { Trade } from "../../context/TradeContext";
import type { ReferralMeResponse } from "../../services/referralService";
import { getReferralMe, generateReferralCode } from "../../services/referralService";




// React Icons imports
import { 
  FaLock, 
  FaMobileAlt, 
  FaTrophy, 
  FaFire, 
  FaChartLine, 
  FaDollarSign, 
  FaChartBar 
} from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { FaBullseye } from 'react-icons/fa';

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

const formatCurrency = (num: number | undefined, decimals: number = 0): string =>
  typeof num === "number"
    ? "₹" + num.toLocaleString(undefined, { maximumFractionDigits: decimals })
    : "--";

const Settings: React.FC = () => {
  const { user, updateAvatar, loading, changeUsername, changePassword } = useAuth();
  const { trades, fetchTrades } = useTrades();
  const toast = useCustomToast(); // Add toast hook
  const [referralInfo, setReferralInfo] = useState<ReferralMeResponse | null>(null);
const [referralLoading, setReferralLoading] = useState<boolean>(false);



  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [showUserModal, setShowUserModal] = useState<boolean>(false);
  const [showPasswordModal, setShowPasswordModal] = useState<boolean>(false);
  
  const [newUsername, setNewUsername] = useState<string>("");
  // Remove manual error/success states - we'll use toasts instead
  // const [usernameError, setUsernameError] = useState<string>("");
  // const [usernameSuccess, setUsernameSuccess] = useState<string>("");

  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPass, setConfirmPass] = useState<string>("");
  // Remove manual error/success states - we'll use toasts instead
  // const [passwordError, setPasswordError] = useState<string>("");
  // const [passwordSuccess, setPasswordSuccess] = useState<string>("");

  // Fetch all trades for lifetime when the component mounts
  useEffect(() => {
    fetchTrades("lifetime");
  }, [fetchTrades]);

  useEffect(() => {
  const run = async () => {
    try {
      const savedToken = localStorage.getItem("token");
      if (!savedToken) return;

      setReferralLoading(true);
      const data = await getReferralMe(savedToken);
      setReferralInfo(data);
    } catch (err) {
      console.error("Failed to fetch referral info:", err);
    } finally {
      setReferralLoading(false);
    }
  };

  run();
}, []);


  const refreshReferralInfo = async () => {
  try {
    const savedToken = localStorage.getItem("token");
    if (!savedToken) return;

    setReferralLoading(true);
    const data = await getReferralMe(savedToken);
    setReferralInfo(data);
  } catch (err) {
    console.error("Failed to refresh referral info:", err);
  } finally {
    setReferralLoading(false);
  }
};

const handleGenerateCoupon = async () => {
  try {
    const savedToken = localStorage.getItem("token");
    if (!savedToken) {
      toast.showErrorToast("Please login again.");
      return;
    }

    setReferralLoading(true);
    const res = await generateReferralCode(savedToken);

    toast.showSuccessToast(`✅ Coupon generated: ${res.code}`);
    await refreshReferralInfo();
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to generate coupon";
    toast.showErrorToast(msg);
  } finally {
    setReferralLoading(false);
  }
};

const handleCopyCoupon = async (code: string) => {
  try {
    await navigator.clipboard.writeText(code);
    toast.showSuccessToast("📋 Coupon code copied!");
  } catch {
    toast.showErrorToast("Failed to copy coupon");
  }
};



  // Your existing calculateStreaks function stays the same...
  const calculateStreaks = (trades: Trade[]): { current: number; max: number } => {
    if (!trades || trades.length === 0) return { current: 0, max: 0 };

    const uniqueDatesSet = new Set<string>();
    trades.forEach((trade) => {
      const dateStr = new Date(trade.date).toISOString().slice(0, 10);
      uniqueDatesSet.add(dateStr);
    });

    const uniqueDates = Array.from(uniqueDatesSet)
      .map(dateStr => new Date(dateStr))
      .sort((a, b) => a.getTime() - b.getTime());

    if (uniqueDates.length === 0) return { current: 0, max: 0 };
    if (uniqueDates.length === 1) return { current: 1, max: 1 };

    let maxStreak = 1;
    let tempStreak = 1;

    for (let i = 1; i < uniqueDates.length; i++) {
      const daysDiff = (uniqueDates[i].getTime() - uniqueDates[i - 1].getTime()) / (1000 * 60 * 60 * 24);
      
      if (daysDiff === 1) {
        tempStreak++;
      } else {
        maxStreak = Math.max(maxStreak, tempStreak);
        tempStreak = 1;
      }
    }
    maxStreak = Math.max(maxStreak, tempStreak);

    const today = new Date();
    const todayStr = today.toISOString().slice(0, 10);
    const yesterday = new Date(today.getTime() - (24 * 60 * 60 * 1000));
    const yesterdayStr = yesterday.toISOString().slice(0, 10);
    
    const lastTradeDateStr = uniqueDates[uniqueDates.length - 1].toISOString().slice(0, 10);

    if (lastTradeDateStr === todayStr || lastTradeDateStr === yesterdayStr) {
      let currentStreak = 1;
      
      for (let i = uniqueDates.length - 1; i > 0; i--) {
        const daysDiff = (uniqueDates[i].getTime() - uniqueDates[i - 1].getTime()) / (1000 * 60 * 60 * 24);
        
        if (daysDiff === 1) {
          currentStreak++;
        } else {
          break;
        }
      }
      
      return { current: currentStreak, max: maxStreak };
    } else {
      return { current: 0, max: maxStreak };
    }
  };

  // Your existing tradeStats calculation stays the same...
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

    const best = trades.reduce(
      (a: Trade, b: Trade) => ((b.pnl_amount ?? -Infinity) > (a.pnl_amount ?? -Infinity) ? b : a),
      trades[0]
    );
    const worst = trades.reduce(
      (a: Trade, b: Trade) => ((b.pnl_amount ?? Infinity) < (a.pnl_amount ?? Infinity) ? b : a),
      trades[0]
    );

    const symCount: Record<string, number> = {}; 
    trades.forEach((t: Trade) => {
      if (t.symbol) {
        symCount[t.symbol] = (symCount[t.symbol] ?? 0) + 1;
      }
    });

    const mostSymbol = Object.entries(symCount).sort(([, a], [, b]) => b - a)[0]?.[0] ?? null;

    const sortedDates = trades
      .map((t: Trade) => t.date)
      .sort((a: string, b: string) => new Date(a).getTime() - new Date(b).getTime());

    const first = sortedDates.length > 0 ? new Date(sortedDates[0]) : null;
    const last = sortedDates.length > 0 ? new Date(sortedDates[sortedDates.length - 1]) : null;
    
    const totalProfit = trades.reduce((sum, trade) => sum + (trade.pnl_amount || 0), 0);
    
    const winningTrades = trades.filter(trade => (trade.pnl_amount || 0) > 0).length;
    const winRate = trades.length > 0 ? (winningTrades / trades.length) * 100 : 0;

    const streaks = calculateStreaks(trades);

    return {
      total: trades.length,
      best,
      worst,
      mostSymbol,
      first,
      last,
      totalProfit,
      winRate,
      currentStreak: streaks.current,
      maxStreak: streaks.max
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

  // UPDATED: Avatar change with toast messages
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Client-side validation with toast messages
    if (file.size > 5 * 1024 * 1024) {
      toast.files.uploadLimit();
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      toast.files.invalidFormat();
      return;
    }
    
    setAvatarPreview(URL.createObjectURL(file));
    
    try {
      await updateAvatar(file);
      toast.showSuccessToast("Profile picture updated successfully!");
    } catch (error) {
      toast.handleApiError(error);
      setAvatarPreview(null); // Reset preview on error
    }
  };

  const handleAvatarClick = (): void => {
    fileInputRef.current?.click();
  };

  // UPDATED: Username change with toast messages
  const handleUsernameSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    // Client-side validation
    if (!newUsername.trim()) {
      toast.handleValidationError("Username", "required");
      return;
    }

    if (newUsername.trim().length < 3) {
      toast.showErrorToast("Username must be at least 3 characters long.");
      return;
    }

    if (newUsername.trim() === user?.username) {
      toast.showWarningToast("Please enter a different username.");
      return;
    }
    
    try {
      await changeUsername(newUsername.trim());
      toast.showSuccessToast("Username updated successfully!");
      setNewUsername("");
      
      // Close modal after short delay
      setTimeout(() => {
        setShowUserModal(false);
      }, 1500);
    } catch (error) {
      toast.handleApiError(error);
    }
  };

  // UPDATED: Password change with toast messages
  const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    // Client-side validation
    if (!currentPassword) {
      toast.handleValidationError("Current password", "required");
      return;
    }

    if (!newPassword) {
      toast.handleValidationError("New password", "required");
      return;
    }

    if (newPassword.length < 6) {
      toast.showErrorToast("New password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPass) {
      toast.showErrorToast("New password and confirmation don't match.");
      return;
    }

    if (currentPassword === newPassword) {
      toast.showWarningToast("New password must be different from current password.");
      return;
    }
    
    try {
      await changePassword(currentPassword, newPassword);
      toast.showSuccessToast("Password updated successfully!");
      
      // Clear form
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPass("");
      
      // Close modal after short delay
      setTimeout(() => {
        setShowPasswordModal(false);
      }, 1500);
    } catch (error) {
      toast.handleApiError(error);
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
              <p>Manage your personal information and subscription details</p>
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
                  
                  {/* Subscription Information */}
                  <div className={Styles.subscriptionDetails}>
                    <div className={Styles.detailItem}>
                      <label className={Styles.detailLabel}>Plan</label>
                      <div className={Styles.detailValue}>
                        <span className={`${Styles.subscriptionBadge} ${
                          user?.subscription?.plan === 'pro' ? Styles.proBadge : Styles.freeBadge
                        }`}>
                          {user?.subscription?.plan?.toUpperCase() || "FREE"}
                        </span>
                      </div>
                    </div>
                    
                    {user?.subscription?.startedAt && (
                      <div className={Styles.detailItem}>
                        <label className={Styles.detailLabel}>Started</label>
                        <div className={Styles.detailValue}>
                          {new Date(user.subscription.startedAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long', 
                            day: 'numeric'
                          })}
                        </div>
                      </div>
                    )}
                    
                    {user?.subscription?.expiresAt && (
                      <div className={Styles.detailItem}>
                        <label className={Styles.detailLabel}>Expires</label>
                        <div className={`${Styles.detailValue} ${
                          new Date(user.subscription.expiresAt) > new Date() 
                            ? Styles.validExpiry 
                            : Styles.expiredPlan
                        }`}>
                          {new Date(user.subscription.expiresAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                    )}
                    
                    {user?.subscription?.expiresAt && (
                      <div className={Styles.detailItem}>
                        <label className={Styles.detailLabel}>Time Remaining</label>
                        <div className={`${Styles.detailValue} ${Styles.timeRemaining} ${
                          new Date(user.subscription.expiresAt) > new Date() 
                            ? Styles.validTime 
                            : Styles.expiredTime
                        }`}>
                          {(() => {
                            const now = new Date();
                            const expiry = new Date(user.subscription.expiresAt);
                            const diff = expiry.getTime() - now.getTime();
                            
                            if (diff <= 0) {
                              return 'Expired';
                            }
                            
                            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                            
                            if (days > 0) {
                              return `${days} day${days !== 1 ? 's' : ''}, ${hours} hour${hours !== 1 ? 's' : ''}`;
                            } else if (hours > 0) {
                              return `${hours} hour${hours !== 1 ? 's' : ''}, ${minutes} minute${minutes !== 1 ? 's' : ''}`;
                            } else {
                              return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
                            }
                          })()}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Referral Section */}
<div className={Styles.subscriptionDetails}>
  <div className={Styles.detailItem}>
    <label className={Styles.detailLabel}>Your Coupon Code</label>

    <div className={Styles.detailValue} style={{ display: "flex", gap: "10px", alignItems: "center" }}>
      {referralLoading ? (
        <span>Loading...</span>
      ) : referralInfo?.referral?.code ? (
        <>
          <strong>{referralInfo.referral.code}</strong>

          <button
            type="button"
            className={Styles.secondaryButton}
            style={{ padding: "6px 10px", fontSize: "12px" }}
            onClick={() => handleCopyCoupon(referralInfo.referral?.code || "")}
          >
            Copy
          </button>
        </>
      ) : (
        <button
          type="button"
          className={Styles.primaryButton}
          style={{ padding: "8px 14px", fontSize: "13px" }}
          onClick={handleGenerateCoupon}
          disabled={referralLoading}
        >
          {referralLoading ? "Generating..." : "Generate Coupon"}
        </button>
      )}
    </div>
  </div>

  <div className={Styles.detailItem}>
    <label className={Styles.detailLabel}>Paid Referrals</label>
    <div className={Styles.detailValue}>
      {referralInfo?.referral?.stats?.totalPaidReferrals ?? 0}
    </div>
  </div>

  <div className={Styles.detailItem}>
    <label className={Styles.detailLabel}>Total Reward Days</label>
    <div className={Styles.detailValue}>
      {(referralInfo?.referral?.stats?.totalRewardDays ?? 0)} days
    </div>
  </div>
</div>


          {/* Security Section - stays the same */}
          <div className={Styles.sectionCard}>
            <div className={Styles.sectionHeader}>
              <h2>Security</h2>
              <p>Manage your password and account security settings</p>
            </div>
            <div className={Styles.sectionBody}>
              <div className={Styles.securityGrid}>
                <div className={Styles.securityItem}>
                  <div className={Styles.securityIcon}>
                    <FaLock />
                  </div>
                  <div className={Styles.securityInfo}>
                    <h3>Password</h3>
                    <p>Keep your account secure with a strong password</p>
                  </div>
                  <button 
                    className={Styles.primaryButton}
                    onClick={() => setShowPasswordModal(true)}
                  >
                    Update
                  </button>
                </div>
                
                <div className={Styles.securityItem}>
                  <div className={Styles.securityIcon}>
                    <FaMobileAlt />
                  </div>
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

          {/* Trading Stats Section - stays the same */}
          <div className={Styles.sectionCard}>
            <div className={Styles.sectionHeader}>
              <h2>Trading Statistics</h2>
              <p>Your overall trading performance summary</p>
            </div>
            <div className={Styles.sectionBody}>
              <div className={Styles.statsGrid}>
                <div className={Styles.statCard}>
                  <div className={Styles.statHeader}>
                    <div className={Styles.statIcon}>
                      <FaChartLine />
                    </div>
                    <h3>Total Trades</h3>
                  </div>
                  <div className={Styles.statValue}>{tradeStats.total}</div>
                </div>
                
                <div className={Styles.statCard}>
                  <div className={Styles.statHeader}>
                    <div className={Styles.statIcon}>
                      <FaDollarSign />
                    </div>
                    <h3>Total Profit</h3>
                  </div>
                  <div className={Styles.statValue}>{formatCurrency(tradeStats.totalProfit)}</div>
                </div>
                
                <div className={Styles.statCard}>
                  <div className={Styles.statHeader}>
                    <div className={Styles.statIcon}>
                      <FaBullseye />
                    </div>
                    <h3>Win Rate</h3>
                  </div>
                  <div className={Styles.statValue}>{tradeStats.winRate.toFixed(1)}%</div>
                </div>
                
                <div className={Styles.statCard}>
                  <div className={Styles.statHeader}>
                    <div className={Styles.statIcon}>
                      <FaChartBar />
                    </div>
                    <h3>Most Traded</h3>
                  </div>
                  <div className={Styles.statValue}>{tradeStats.mostSymbol || "--"}</div>
                </div>

                <div className={Styles.statCard}>
                  <div className={Styles.statHeader}>
                    <div className={Styles.statIcon}>
                      <FaFire />
                    </div>
                    <h3>Current Streak</h3>
                  </div>
                  <div className={Styles.statValue}>{tradeStats.currentStreak} days</div>
                </div>

                <div className={Styles.statCard}>
                  <div className={Styles.statHeader}>
                    <div className={Styles.statIcon}>
                      <FaTrophy />
                    </div>
                    <h3>Max Streak</h3>
                  </div>
                  <div className={Styles.statValue}>{tradeStats.maxStreak} days</div>
                </div>
              </div>
              
              <div className={Styles.advancedStats}>
                <h3>Performance Highlights</h3>
                <div className={Styles.highlightsGrid}>
                  <div className={Styles.highlightItem}>
                    <span className={Styles.highlightLabel}>Best Trade</span>
                    <span className={`${Styles.highlightValue} ${Styles.positive}`}>
                      {tradeStats.best ? formatCurrency(tradeStats.best.pnl_amount) : "--"}
                    </span>
                  </div>
                  <div className={Styles.highlightItem}>
                    <span className={Styles.highlightLabel}>Worst Trade</span>
                    <span className={`${Styles.highlightValue} ${Styles.negative}`}>
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

      {/* UPDATED: Username Change Modal - removed error/success divs */}
      {showUserModal && (
        <div className={Styles.modalOverlay}>
          <div className={Styles.modal}>
            <div className={Styles.modalHeader}>
              <h2>Change Username</h2>
              <button 
                className={Styles.closeButton}
                onClick={() => {
                  setShowUserModal(false);
                  setNewUsername(""); // Clear form on close
                }}
              >
                <IoClose />
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
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewUsername(e.target.value)}
                    disabled={loading}
                    minLength={3}
                    required
                  />
                </div>
                <div className={Styles.modalActions}>
                  <button 
                    type="button" 
                    className={Styles.secondaryButton}
                    onClick={() => {
                      setShowUserModal(false);
                      setNewUsername(""); // Clear form on cancel
                    }}
                  >
                    Cancel
                  </button>
                  <button type="submit" className={Styles.primaryButton} disabled={loading}>
                    Update Username
                  </button>
                </div>
                {/* Removed error/success message divs - using toasts now */}
              </form>
            </div>
          </div>
        </div>
      )}

      {/* UPDATED: Password Change Modal - removed error/success divs */}
      {showPasswordModal && (
        <div className={Styles.modalOverlay}>
          <div className={Styles.modal}>
            <div className={Styles.modalHeader}>
              <h2>Change Password</h2>
              <button 
                className={Styles.closeButton}
                onClick={() => {
                  setShowPasswordModal(false);
                  // Clear form on close
                  setCurrentPassword("");
                  setNewPassword("");
                  setConfirmPass("");
                }}
              >
                <IoClose />
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
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCurrentPassword(e.target.value)}
                    disabled={loading}
                    required
                  />
                </div>
                <div className={Styles.formGroup}>
                  <label className={Styles.formLabel}>New Password</label>
                  <input
                    className={Styles.formInput}
                    type="password"
                    placeholder="New password (min 6 characters)"
                    autoComplete="new-password"
                    value={newPassword}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewPassword(e.target.value)}
                    disabled={loading}
                    required
                    minLength={6}
                  />
                </div>
                <div className={Styles.formGroup}>
                  <label className={Styles.formLabel}>Confirm New Password</label>
                  <input
                    className={Styles.formInput}
                    type="password"
                    placeholder="Confirm new password"
                    autoComplete="new-password"
                    value={confirmPass}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPass(e.target.value)}
                    disabled={loading}
                    required
                    minLength={6}
                  />
                </div>
                <div className={Styles.modalActions}>
                  <button 
                    type="button" 
                    className={Styles.secondaryButton}
                    onClick={() => {
                      setShowPasswordModal(false);
                      // Clear form on cancel
                      setCurrentPassword("");
                      setNewPassword("");
                      setConfirmPass("");
                    }}
                  >
                    Cancel
                  </button>
                  <button type="submit" className={Styles.primaryButton} disabled={loading}>
                    Update Password
                  </button>
                </div>
                {/* Removed error/success message divs - using toasts now */}
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
