import { useState } from 'react';
import PricingNav from "../../components/PricingNav/PricingNav";
import Styles from "./PricingPage.module.css";
import { IoMdAdd } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import PaymentButton from "../../components/PaymentButton/PaymentButton";
import { upgradeUserToPro } from '../../services/subscriptionService';
import { useAuth } from '../../hooks/useAuth';
import { hasActivePro } from '../../utils/subscriptionUtils';

interface FAQItem {
  question: string;
  answer: string;
}

const PricingPage = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { user, updateUserData } = useAuth();
  const navigate = useNavigate();

  const handleToggle = (index: number): void => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handlePaymentSuccess = async (paymentId: string): Promise<void> => {
    console.log('Payment successful:', paymentId);
    
    if (!user) {
      alert('❌ User not found. Please login again.');
      return;
    }

    try {
      // Show immediate feedback
      alert('🎉 Payment successful! Upgrading your subscription...');

      // Call backend to upgrade subscription to Pro for 1 month
      const response = await upgradeUserToPro(user.id, paymentId);
      
      if (response.success && response.data) {
        // Update user context with new subscription data
        updateUserData(response.data);
        
        console.log('✅ Subscription upgraded:', {
          plan: response.data.subscription.plan,
          expiresAt: response.data.subscription.expiresAt
        });
        
        // Success message
        alert('✅ Welcome to TradeJournalAI Pro! You now have 1 month of premium access.');
        
        // Redirect to dashboard after a short delay
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      } else {
        throw new Error(response.message || 'Failed to upgrade subscription');
      }

    } catch (error) {
      console.error('Subscription upgrade failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      alert(`❌ Payment successful but upgrade failed. Please contact support with Payment ID: ${paymentId}\nError: ${errorMessage}`);
    }
  };

  const handlePaymentFailure = (error: string): void => {
    console.error('Payment failed:', error);
    alert('❌ Payment failed. Please try again or contact support.');
  };

  // Use proper subscription checking with your utils
  const isSubscribed = hasActivePro(user);

  const faqs: FAQItem[] = [
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit/debit cards, UPI payments, and net banking through secure Razorpay payment gateway."
    },
    {
      question: "Can I cancel my subscription anytime?",
      answer: "Yes, you can cancel your subscription anytime and you'll continue to have access until the end of your current billing period."
    },
    {
      question: "Is there a free trial available?",
      answer: "Yes! We offer a 24-hour free trial for all new users to explore all premium features before subscribing."
    },
    {
      question: "How does the AI-powered trade insights work?",
      answer: "Our AI analyzes your trading patterns, performance metrics, and provides personalized recommendations to improve your trading strategy."
    },
    {
      question: "Will I lose my data if I cancel my subscription?",
      answer: "No, your data remains safe and secure. If you resubscribe later, all your historical trading data will still be available."
    },
    {
      question: "Do you offer discounts for annual plans?",
      answer: "Currently we offer monthly subscriptions at ₹99. We're working on annual plans with attractive discounts coming soon!"
    }
  ];

  return (
    <div className={Styles.pricingPageContainer}>
      <div id="pricing" className={Styles.pricingHero}>
        <div className={Styles.pricingNavContainer}>
          <PricingNav />
        </div>
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
              🎉 Start with 24 hours FREE trial!
            </div>
            
            <ul className={Styles.features}>
              <li>✅ Unlimited trade journaling</li>
              <li>✅ Advanced charts and graphs</li>
              <li>✅ AI-powered trade insights</li>
              <li>✅ Psychology & risk analysis</li>
              <li>✅ Monthly performance reports</li>
              <li>✅ Secure cloud backup</li>
              <li>✅ Priority support</li>
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
                  ✅ Currently Active
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
              </div>
            )}
          </div>
        </div>
      </div>

      <div id="faqs" className={Styles.faqs}>
        <div className={Styles.faqsContainer}>
          <h2 className={Styles.faqsTitle}>Frequently Asked Questions</h2>
          <p className={Styles.faqsSubtitle}>Everything you need to know about the product and billing</p>
          
          <div className={Styles.faqsList}>
            {faqs.map((faq, index: number) => (
              <div key={index} className={Styles.faqItem}>
                <details 
                  className={Styles.faqDetails}
                  open={openIndex === index}
                  onClick={(e) => {
                    e.preventDefault();
                    handleToggle(index);
                  }}
                >
                  <summary className={Styles.faqQuestion}>
                    {faq.question}
                    <span 
                      className={`${Styles.faqIcon} ${openIndex === index ? Styles.rotated : ''}`}
                    >
                      <IoMdAdd />
                    </span>
                  </summary>
                  <div className={Styles.faqAnswer}>{faq.answer}</div>
                </details>
              </div>
            ))}
          </div>
          
          <div className={Styles.faqsCta}>
            <p>Still have questions?</p>
            <button 
              className={Styles.ctaButton}
              onClick={() => window.location.href = 'mailto:support@tradejournalai.in'}
            >
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
