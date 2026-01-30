import Styles from "./PricingCard.module.css";
import { Link, useNavigate } from "react-router-dom";
import PaymentButton from "../../components/PaymentButton/PaymentButton";
import { upgradeUserToPro } from "../../services/subscriptionService";
import { useAuth } from "../../hooks/useAuth";
import { hasActivePro } from "../../utils/subscriptionUtils";
import { useCustomToast } from "../../hooks/useCustomToast";
import { useEffect, useMemo, useState } from "react";
import { getReferralMe } from "../../services/referralService";
import type { ReferralMeResponse } from "../../services/referralService";

const PricingCard = () => {
  const { user, updateUserData, token } = useAuth();
  const navigate = useNavigate();
  const toast = useCustomToast();
  const [processingPlan, setProcessingPlan] = useState<string | null>(null);

  // ✅ Referral discount info
  const [referralInfo, setReferralInfo] = useState<ReferralMeResponse | null>(null);

  useEffect(() => {
    const run = async () => {
      try {
        const savedToken = token || localStorage.getItem("token");
        if (!savedToken) return;

        const data = await getReferralMe(savedToken);
        setReferralInfo(data);
      } catch (err) {
        console.error("Failed to fetch referral info:", err);
      }
    };
    run();
  }, [token]);

  const discountUnlocked = referralInfo?.referral?.discountUnlocked === true;
  const discountPercent = referralInfo?.referral?.discountPercent ?? 0;

  const calculateDiscountedPrice = (price: number): number => {
    if (!discountUnlocked || discountPercent <= 0) return price;
    return Math.round((price * (100 - discountPercent)) / 100);
  };

  const monthlyOriginal = 99;
  const annualOriginal = 799;

  const monthlyPayable = useMemo(
    () => calculateDiscountedPrice(monthlyOriginal),
    [discountUnlocked, discountPercent]
  );

  const annualPayable = useMemo(
    () => calculateDiscountedPrice(annualOriginal),
    [discountUnlocked, discountPercent]
  );

  const handlePaymentSuccess = async (
    paymentId: string,
    planType: "monthly" | "annual"
  ): Promise<void> => {
    console.log("Payment successful:", paymentId, planType);
    setProcessingPlan(planType);

    if (!user) {
      toast.showErrorToast("❌ User not found. Please login again.");
      setProcessingPlan(null);
      return;
    }

    try {
      const duration = planType === "annual" ? "1 year" : "1 month";
      toast.showInfoToast(
        `🔄 Payment successful! Upgrading your ${duration} subscription...`
      );

      const response = await upgradeUserToPro(user.id, paymentId, planType);

      if (response.success && response.data) {
        updateUserData(response.data);

        console.log("✅ Subscription upgraded:", {
          plan: response.data.subscription.plan,
          type: response.data.subscription.type,
          expiresAt: response.data.subscription.expiresAt,
        });

        const successMessage =
          planType === "annual"
            ? "🎉 Welcome to TradeJournalAI Pro Annual! You now have 1 year of premium access."
            : "🎉 Welcome to TradeJournalAI Pro Monthly! You now have 1 month of premium access.";

        toast.showSuccessToast(successMessage);

        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      } else {
        throw new Error(response.message || "Failed to upgrade subscription");
      }
    } catch (error) {
      console.error("Subscription upgrade failed:", error);
      toast.handleApiError(error);
      toast.showWarningToast(
        `Please save this Payment ID for support: ${paymentId}`
      );
    } finally {
      setProcessingPlan(null);
    }
  };

  const handlePaymentFailure = (error: string): void => {
    console.error("Payment failed:", error);
    toast.showErrorToast("❌ Payment failed. Please try again or contact support.");
    setProcessingPlan(null);
  };

  const isSubscribed = hasActivePro(user);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getTimeRemaining = (expiresAt: string) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diff = expiry.getTime() - now.getTime();

    if (diff <= 0) return "Expired";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) {
      return `${days} day${days !== 1 ? "s" : ""}, ${hours} hour${
        hours !== 1 ? "s" : ""
      }`;
    } else {
      return `${hours} hour${hours !== 1 ? "s" : ""}`;
    }
  };

  return (
    <div className={`${Styles.pricingPageContainer}`}>
      <div id="pricing" className={Styles.pricingHero}>
        <h1 className={Styles.pageTitle}>Choose Your Plan</h1>
        <p className={Styles.pageSubtitle}>
          Select the plan that works best for your trading journey
        </p>

        {/* ✅ Coupon Banner */}
{discountUnlocked && discountPercent > 0 && (
  <div className={Styles.couponBanner}>
    🎉 Coupon Applied — You are getting <strong>{discountPercent}% OFF</strong>!
  </div>
)}


        <div className={Styles.pricingCards}>
          {/* Monthly Plan Card */}
          <div className={Styles.pricingCard}>
            <div className={Styles.cardHeader}>
              <h3>Premium Plan</h3>
              <p>Perfect for serious traders</p>
            </div>

            <div className={Styles.priceContainer}>
              <div className={Styles.price}>
                {discountUnlocked && discountPercent > 0 ? (
                  <div style={{ display: "flex", alignItems: "baseline", gap: "10px" }}>
                    <span
                      style={{
                        fontSize: "18px",
                        textDecoration: "line-through",
                        opacity: 0.6,
                      }}
                    >
                      ₹{monthlyOriginal}
                    </span>

                    <span className={Styles.amount}>₹{monthlyPayable}</span>

                    <span className={Styles.period}>/month</span>
                  </div>
                ) : (
                  <>
                    <span className={Styles.currency}>₹</span>
                    <span className={Styles.amount}>{monthlyOriginal}</span>
                    <span className={Styles.period}>/month</span>
                  </>
                )}
              </div>

              {/* ✅ Discount Badge */}
              {discountUnlocked && discountPercent > 0 ? (
                <div
                  className={Styles.effectivePrice}
                  style={{ fontWeight: 600 }}
                >
                  ✅ {discountPercent}% off via coupon
                </div>
              ) : (
                <div className={Styles.effectivePrice}>Billed monthly</div>
              )}
            </div>

            <div className={Styles.trialNotice}>Start with 1 week FREE trial!</div>

            <ul className={Styles.features}>
              <li>Unlimited trades journaling.</li>
              <li>Advanced charts & graphs</li>
              <li>AI powered trades insights</li>
              <li>Psychology & Risk management analytics.</li>
              <li>Monthly performance reports</li>
              <li>Secured cloud backup</li>
              <li>Advanced analytics dashboard</li>
              <li>Standard support.</li>
            </ul>

            <div className={Styles.buttonContainer}>
              {!user ? (
                <Link to="/login">
                  <button className={Styles.ctaButton}>Login to Start Free Trial</button>
                </Link>
              ) : isSubscribed ? (
                <button className={`${Styles.ctaButton} ${Styles.activeButton}`}>
                  Currently Active
                </button>
              ) : (
                <PaymentButton
                  amount={monthlyPayable}
                  userEmail={user.email}
                  planType="monthly"
                  onSuccess={(paymentId, plan) =>
                    handlePaymentSuccess(paymentId, plan as "monthly" | "annual")
                  }
                  onFailure={handlePaymentFailure}
                  disabled={processingPlan !== null}
                />
              )}
            </div>

            {user && (
              <div className={Styles.subscriptionInfo}>
                <p className={Styles.planInfo}>
                  Current Plan: <strong>{user.subscription.plan.toUpperCase()}</strong>
                  {user.subscription.type && ` (${user.subscription.type})`}
                </p>

                {user.subscription.expiresAt && (
                  <p className={Styles.expiryInfo}>
                    {isSubscribed ? (
                      <>Expires: {formatDate(user.subscription.expiresAt)}</>
                    ) : (
                      <span className={Styles.expiredText}>
                        Expired: {formatDate(user.subscription.expiresAt)}
                      </span>
                    )}
                  </p>
                )}

                {user.subscription.expiresAt && (
                  <p className={Styles.timeInfo}>
                    <strong>Time Remaining: </strong>
                    <span
                      className={
                        new Date(user.subscription.expiresAt) > new Date()
                          ? Styles.validTime
                          : Styles.expiredTime
                      }
                    >
                      {getTimeRemaining(user.subscription.expiresAt)}
                    </span>
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Annual Plan Card */}
          <div className={`${Styles.pricingCard} ${Styles.highlightedCard}`}>
            <div className={Styles.limitedTimeBadge}>Limited Time Offer</div>

            <div className={Styles.cardHeader}>
              <h3>Premium Plus</h3>
              <p>Best value - save over 30%</p>
            </div>

            <div className={Styles.priceContainer}>
              <div className={Styles.price}>
                {discountUnlocked && discountPercent > 0 ? (
                  <div style={{ display: "flex", alignItems: "baseline", gap: "10px" }}>
                    <span
                      style={{
                        fontSize: "18px",
                        textDecoration: "line-through",
                        opacity: 0.6,
                      }}
                    >
                      ₹{annualOriginal}
                    </span>

                    <span className={Styles.amount}>₹{annualPayable}</span>

                    <span className={Styles.period}>/year</span>
                  </div>
                ) : (
                  <>
                    <span className={Styles.currency}>₹</span>
                    <span className={Styles.amount}>{annualOriginal}</span>
                    <span className={Styles.period}>/ year</span>
                  </>
                )}
              </div>

              {/* Keep your existing "save 33%" section */}
              <div className={Styles.discountSection}>
                <div className={Styles.originalPrice}>
                  <span className={Styles.strikethrough}>₹1,188</span>
                  <span className={Styles.saveBadge}>Save 33%</span>
                </div>
              </div>

              {/* ✅ Discount Badge */}
              {discountUnlocked && discountPercent > 0 && (
                <div
                  className={Styles.effectivePrice}
                  style={{ marginTop: "8px", fontWeight: 600 }}
                >
                  ✅ {discountPercent}% off via coupon
                </div>
              )}
            </div>

            <div className={Styles.trialNotice}>Start with 1 week FREE trial!</div>

            <ul className={Styles.features}>
              <li>Unlimited trades journaling.</li>
              <li>Advanced charts & graphs</li>
              <li>AI powered trades insights</li>
              <li>Psychology & Risk management analytics.</li>
              <li>Monthly performance reports</li>
              <li>Advanced analytics dashboard</li>
              <li>Priority support.</li>
              <li>Early access to new features</li>
            </ul>

            <div className={Styles.buttonContainer}>
              {!user ? (
                <Link to="/login">
                  <button className={Styles.ctaButton}>Login to Start Free Trial</button>
                </Link>
              ) : isSubscribed ? (
                <button className={`${Styles.ctaButton} ${Styles.activeButton}`}>
                  Currently Active
                </button>
              ) : (
                <PaymentButton
                  amount={annualPayable}
                  userEmail={user.email}
                  planType="annual"
                  onSuccess={(paymentId, plan) =>
                    handlePaymentSuccess(paymentId, plan as "monthly" | "annual")
                  }
                  onFailure={handlePaymentFailure}
                  disabled={processingPlan !== null}
                />
              )}
            </div>

            {user && (
              <div className={Styles.subscriptionInfo}>
                <p className={Styles.planInfo}>
                  Current Plan: <strong>{user.subscription.plan.toUpperCase()}</strong>
                  {user.subscription.type && ` (${user.subscription.type})`}
                </p>

                {user.subscription.expiresAt && (
                  <p className={Styles.expiryInfo}>
                    {isSubscribed ? (
                      <>Expires: {formatDate(user.subscription.expiresAt)}</>
                    ) : (
                      <span className={Styles.expiredText}>
                        Expired: {formatDate(user.subscription.expiresAt)}
                      </span>
                    )}
                  </p>
                )}

                {user.subscription.expiresAt && (
                  <p className={Styles.timeInfo}>
                    <strong>Time Remaining: </strong>
                    <span
                      className={
                        new Date(user.subscription.expiresAt) > new Date()
                          ? Styles.validTime
                          : Styles.expiredTime
                      }
                    >
                      {getTimeRemaining(user.subscription.expiresAt)}
                    </span>
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingCard;
