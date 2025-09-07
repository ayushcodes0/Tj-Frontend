import Styles from "./PricingPage.module.css";
import { Link, useNavigate } from "react-router-dom";
import PaymentButton from "../../components/PaymentButton/PaymentButton";
import { upgradeUserToPro } from '../../services/subscriptionService';
import { useAuth } from '../../hooks/useAuth';
import { hasActivePro } from '../../utils/subscriptionUtils';
import { useCustomToast } from '../../hooks/useCustomToast'; // Your custom toast hook


const PricingPage = () => {
  const { user, updateUserData } = useAuth();
  const navigate = useNavigate();
  const toast = useCustomToast(); // Use your custom toast hook


  const handlePaymentSuccess = async (paymentId: string): Promise<void> => {
    console.log('Payment successful:', paymentId);
    
    if (!user) {
      toast.showErrorToast('❌ User not found. Please login again.');
      return;
    }

    try {
      // Show processing toast
      toast.showInfoToast('🔄 Payment successful! Upgrading your subscription...');

      // Call backend to upgrade subscription to Pro for 1 month
      const response = await upgradeUserToPro(user.id, paymentId);
      
      if (response.success && response.data) {
        // Update user context with new subscription data
        updateUserData(response.data);
        
        console.log('✅ Subscription upgraded:', {
          plan: response.data.subscription.plan,
          expiresAt: response.data.subscription.expiresAt
        });
        
        // Success toast
        toast.showSuccessToast('🎉 Welcome to TradeJournalAI Pro! You now have 1 month of premium access.');
        
        // Redirect to dashboard after a short delay
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        throw new Error(response.message || 'Failed to upgrade subscription');
      }

    } catch (error) {
      console.error('Subscription upgrade failed:', error);
      
      // Handle API errors with your custom toast
      toast.handleApiError(error);
      
      // Additional context for payment ID
      toast.showWarningToast(`Please save this Payment ID for support: ${paymentId}`);
    }
  };

  const handlePaymentFailure = (error: string): void => {
    console.error('Payment failed:', error);
    toast.showErrorToast('❌ Payment failed. Please try again or contact support.');
  };

  // Use proper subscription checking with your utils
  const isSubscribed = hasActivePro(user);


  return (
    <div className={Styles.pricingPageContainer}>
      <div id="pricing" className={Styles.pricingHero}>
        <div className={Styles.pricingCards}>
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
              <li>Priority support</li>
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
                  onSuccess={handlePaymentSuccess}
                  onFailure={handlePaymentFailure}
                />
              )}
            </div>

            {/* Show subscription info for logged in users */}
            {user && (
              <div className={Styles.subscriptionInfo}>
                <p className={Styles.planInfo}>
                  Current Plan: <strong>{user.subscription.plan.toUpperCase()}</strong>
                </p>
                {user.subscription.expiresAt && (
                  <p className={Styles.expiryInfo}>
                    {isSubscribed ? (
                      <>Expires: {new Date(user.subscription.expiresAt).toLocaleDateString()}</>
                    ) : (
                      <span className={Styles.expiredText}>
                        Trial Expired: {new Date(user.subscription.expiresAt).toLocaleDateString()}
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
                    </span>
                  </p>
                )}
              </div>
            )}
          </div>
          <div className={`${Styles.pricingCard} ${Styles.highlightedCard}`}>
            <div className={Styles.badge}>Save over 80%</div>
            <div className={Styles.cardHeader}>
              <h3>Premium Plus</h3>
              <p>Best value - annual commitment</p>
            </div>
            <div className={Styles.price}>
              <div className={Styles.originalPrice}>
                <span className={Styles.strikethrough}>₹2399</span>
              </div>
              <span className={Styles.currency}>₹</span>
              <span className={Styles.amount}>799</span>
              <span className={Styles.period}>/ year</span>
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
              <li>Priority support</li>
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
                  amount={799}
                  userEmail={user.email}
                  onSuccess={handlePaymentSuccess}
                  onFailure={handlePaymentFailure}
                />
              )}
            </div>

            {/* Show subscription info for logged in users */}
            {user && (
              <div className={Styles.subscriptionInfo}>
                <p className={Styles.planInfo}>
                  Current Plan: <strong>{user.subscription.plan.toUpperCase()}</strong>
                </p>
                {user.subscription.expiresAt && (
                  <p className={Styles.expiryInfo}>
                    {isSubscribed ? (
                      <>Expires: {new Date(user.subscription.expiresAt).toLocaleDateString()}</>
                    ) : (
                      <span className={Styles.expiredText}>
                        Trial Expired: {new Date(user.subscription.expiresAt).toLocaleDateString()}
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
