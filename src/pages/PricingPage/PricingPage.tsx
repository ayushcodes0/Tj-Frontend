import { useState } from 'react';
import PricingNav from "../../components/PricingNav/PricingNav"
import Styles from "./PricingPage.module.css"
import { IoMdAdd } from "react-icons/io";

interface FAQItem {
  question: string;
  answer: string;
}

const PricingPage = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };
 const faqs: FAQItem[] =[
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit/debit cards, UPI payments, and net banking through secure payment gateways."
    },
    {
      question: "Can I cancel my subscription anytime?",
      answer: "Yes, you can cancel your subscription anytime and you'll continue to have access until the end of your current billing period."
    },
    {
      question: "Is there a free trial available?",
      answer: "We offer a 7-day free trial for all new users to explore all premium features before committing."
    },
    {
      question: "How does the AI-powered trade insights work?",
      answer: "Our AI analyzes your trading patterns, compares them with market conditions, and provides personalized suggestions to improve your strategy."
    },
    {
      question: "Will I lose my data if I cancel my subscription?",
      answer: "No, your data remains safe. If you resubscribe later, all your historical data will still be available."
    },
    {
      question: "Do you offer discounts for annual plans?",
      answer: "Yes! We offer 20% off when you choose annual billing instead of monthly."
    }
  ];
  return (
    <div className={Styles.pricingPageContainer}>
      <div id="pricing" className={Styles.pricingHero}>
        <div className={Styles.pricingNavContainer}><PricingNav/></div>
        <div className={Styles.pricingCards}>
          <div className={Styles.pricingCard}>
            <div className={Styles.cardHeader}>
              <h3>Premium Plan</h3>
              <p>Perfect for individuals</p>
            </div>
            <div className={Styles.price}>
              <span className={Styles.currency}>₹</span>
              <span className={Styles.amount}>99</span>
              <span className={Styles.period}>/month</span>
            </div>
            <ul className={Styles.features}>
              <li>Unlimited trade journaling</li>
              <li>Advanced charts and graphs</li>
              <li>AI-powered trade insights</li>
              <li>Comprehensive mistake tracking</li>
              <li>Custom strategy analysis</li>
              <li>Ads-free experience</li>
            </ul>
            <button className={Styles.ctaButton}>Get Started</button>
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
                    <span className={Styles.faqIcon}><IoMdAdd/></span>
                  </summary>
                  <div className={Styles.faqAnswer}>{faq.answer}</div>
                </details>
              </div>
            ))}
          </div>
          
          <div className={Styles.faqsCta}>
            <p>Still have questions?</p>
            <button className={Styles.ctaButton}>Contact Support</button>
          </div>
        </div>
      </div>

    </div>
  )
}

export default PricingPage
