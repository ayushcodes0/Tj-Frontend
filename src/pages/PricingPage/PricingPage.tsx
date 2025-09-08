import Styles from "./PricingPage.module.css";
import { Link, useNavigate } from "react-router-dom";
import PaymentButton from "../../components/PaymentButton/PaymentButton";
import { upgradeUserToPro } from '../../services/subscriptionService';
import { useAuth } from '../../hooks/useAuth';
import { hasActivePro } from '../../utils/subscriptionUtils';
import { useCustomToast } from '../../hooks/useCustomToast';
import { useState } from 'react';
import PricingNav from "../../components/PricingNav/PricingNav";

const PricingPage = () => {
  const { user, updateUserData } = useAuth();
  const navigate = useNavigate();
  const toast = useCustomToast();
  const [processingPlan, setProcessingPlan] = useState<string | null>(null);

  // Fix: Change planType parameter type to match what upgradeUserToPro expects
  const handlePaymentSuccess = async (paymentId: string, planType: 'monthly' | 'annual'): Promise<void> => {
    console.log('Payment successful:', paymentId, planType);
    setProcessingPlan(planType);
    
    if (!user) {
      toast.showErrorToast('❌ User not found. Please login again.');
      setProcessingPlan(null);
      return;
    }

    try {
      // Show processing toast
      const duration = planType === 'annual' ? '1 year' : '1 month';
      toast.showInfoToast(`🔄 Payment successful! Upgrading your ${duration} subscription...`);

      // Call backend to upgrade subscription to Pro with the specific plan type
      // This should now work without type errors
      const response = await upgradeUserToPro(user.id, paymentId, planType);
      
      if (response.success && response.data) {
        // Update user context with new subscription data
        updateUserData(response.data);
        
        console.log('✅ Subscription upgraded:', {
          plan: response.data.subscription.plan,
          type: response.data.subscription.type,
          expiresAt: response.data.subscription.expiresAt
        });
        
        // Success toast with appropriate message
        const successMessage = planType === 'annual' 
          ? '🎉 Welcome to TradeJournalAI Pro Annual! You now have 1 year of premium access.'
          : '🎉 Welcome to TradeJournalAI Pro Monthly! You now have 1 month of premium access.';
        
        toast.showSuccessToast(successMessage);
        
        // Redirect to dashboard after a short delay
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        throw new Error(response.message || 'Failed to upgrade subscription');
      }

    } catch (error) {
      console.error('Subscription upgrade failed:', error);
      toast.handleApiError(error);
      toast.showWarningToast(`Please save this Payment ID for support: ${paymentId}`);
    } finally {
      setProcessingPlan(null);
    }
  };

  const handlePaymentFailure = (error: string): void => {
    console.error('Payment failed:', error);
    toast.showErrorToast('❌ Payment failed. Please try again or contact support.');
    setProcessingPlan(null);
  };

  // Use proper subscription checking with your utils
  const isSubscribed = hasActivePro(user);

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Calculate time remaining
  const getTimeRemaining = (expiresAt: string) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diff = expiry.getTime() - now.getTime();
    
    if (diff <= 0) return 'Expired';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) {
      return `${days} day${days !== 1 ? 's' : ''}, ${hours} hour${hours !== 1 ? 's' : ''}`;
    } else {
      return `${hours} hour${hours !== 1 ? 's' : ''}`;
    }
  };

  return (
    <div className={Styles.pricingPageContainer}>
      <div className={Styles.pricingNavContainer}>
        <PricingNav/>
      </div>
      <div id="pricing" className={Styles.pricingHero}>
        
        <div className={Styles.pricingCards}>
          {/* Monthly Plan Card */}
          <div className={Styles.pricingCard}>
            <div className={Styles.cardHeader}>
              <h3>Premium Plan</h3>
              <p>Perfect for serious traders</p>
            </div>
            <div className={Styles.price}>
              <span className={Styles.currency}>₹</span>
              <span className={Styles.amount}>99</span>
              <span className={Styles.period}>/month</span>
            </div>
            
            {/* Free Trial Notice */}
            <div className={Styles.trialNotice}>
              Start with 24 hours FREE trial!
            </div>
            
            <ul className={Styles.features}>
              <li>Unlimited trade journaling</li>
              <li>Advanced charts and graphs</li>
              <li>AI-powered trade insights</li>
              <li>Psychology & risk analysis</li>
              <li>Monthly performance reports</li>
              <li>Secure cloud backup</li>
              <li>Advanced analytics dashboard</li>
            </ul>
            
            {/* Dynamic Button Based on User State */}
            <div className={Styles.buttonContainer}>
              {!user ? (
                <Link to="/login">
                  <button className={Styles.ctaButton}>
                    Login to Start Free Trial
                  </button>
                </Link>
              ) : isSubscribed ? (
                <button className={`${Styles.ctaButton} ${Styles.activeButton}`}>
                  Currently Active
                </button>
              ) : (
                <PaymentButton
                  amount={99}
                  userEmail={user.email}
                  planType="monthly"
                  onSuccess={(paymentId, planType) => handlePaymentSuccess(paymentId, planType as 'monthly' | 'annual')}
                  onFailure={handlePaymentFailure}
                  disabled={processingPlan !== null}
                />
              )}
            </div>

            {/* Show subscription info for logged in users */}
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
                
                {/* Time Remaining Display */}
                {user.subscription.expiresAt && (
                  <p className={Styles.timeInfo}>
                    <strong>Time Remaining: </strong>
                    <span className={`${
                      new Date(user.subscription.expiresAt) > new Date() 
                        ? Styles.validTime 
                        : Styles.expiredTime
                    }`}>
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
                <span className={Styles.currency}>₹</span>
                <span className={Styles.amount}>799</span>
                <span className={Styles.period}>/ year</span>
              </div>
              
              <div className={Styles.discountSection}>
                <div className={Styles.originalPrice}>
                  <span className={Styles.strikethrough}>₹1,188</span>
                  <span className={Styles.saveBadge}>Save 33%</span>
                </div>
              </div>
            </div>
            
            <div className={Styles.trialNotice}>
              Start with 24 hours FREE trial!
            </div>
            
            <ul className={Styles.features}>
              <li>Unlimited trade journaling</li>
              <li>Advanced charts and graphs</li>
              <li>AI-powered trade insights</li>
              <li>Psychology & risk analysis</li>
              <li>Advanced analytics dashboard</li>
              <li>Priority customer support</li>
              <li>Early access to new features</li>
            </ul>
            
            <div className={Styles.buttonContainer}>
              {!user ? (
                <Link to="/login">
                  <button className={Styles.ctaButton}>
                    Login to Start Free Trial
                  </button>
                </Link>
              ) : isSubscribed ? (
                <button className={`${Styles.ctaButton} ${Styles.activeButton}`}>
                  Currently Active
                </button>
              ) : (
                <PaymentButton
                  amount={799}
                  userEmail={user.email}
                  planType="annual"
                  onSuccess={(paymentId, planType) => handlePaymentSuccess(paymentId, planType as 'monthly' | 'annual')}
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
                    <span className={`${
                      new Date(user.subscription.expiresAt) > new Date() 
                        ? Styles.validTime 
                        : Styles.expiredTime
                    }`}>
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

export default PricingPage;