import { useState } from "react";
import Styles from "./Help.module.css";
import { 
  FaChartLine, 
  FaPlus, 
  FaShieldAlt, 
  FaFileAlt,
  FaHeadset,
  FaBullseye
} from "react-icons/fa";
import { IoClose } from "react-icons/io5";

interface FAQItem {
  question: string;
  answer: string;
}

const Help: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [showFAQModal, setShowFAQModal] = useState<boolean>(false);

  // Fixed toggle - only allows one section open at a time
  const toggleSection = (section: string) => {
    setActiveSection(prevActive => prevActive === section ? null : section);
  };

  const faqData: FAQItem[] = [
    {
      question: "How do I add unlimited trades?",
      answer: "As a Pro subscriber, you can add unlimited trades by clicking 'New Trade' from any page. Fill in all the details including psychology data for complete analysis."
    },
    {
      question: "What advanced analytics do I get?",
      answer: "Pro subscribers get advanced P&L charts, risk analysis, psychology insights, monthly reports, streak tracking, and AI-powered trading recommendations."
    },
    {
      question: "How does the psychology analysis work?",
      answer: "Track your confidence levels, emotional states, mistakes, and lessons learned. Our AI analyzes patterns to help improve your trading psychology."
    },
    {
      question: "Can I export my data?",
      answer: "Yes, Pro subscribers can export all trade data, reports, and analytics in CSV or PDF format from the Performance page."
    },
    {
      question: "How do I cancel my Pro subscription?",
      answer: "You can cancel anytime from Settings → Account. Your Pro features remain active until the end of your billing period."
    },
    {
      question: "What's included in priority support?",
      answer: "Pro subscribers get 24/7 live chat support, priority email responses within 2 hours, and direct access to our trading experts."
    }
  ];

  return (
    <div className={Styles.helpContainer}>
      <div className={Styles.header}>
        <h1 className={Styles.pageTitle}>
          <FaChartLine className={Styles.titleIcon} />
          Pro Features Guide
        </h1>
        <p className={Styles.pageSubtitle}>
          Master all the powerful tools available to Pro subscribers
        </p>
      </div>

      <div className={Styles.content}>
        <div className={Styles.mainContent}>
          {/* Pro Features Section */}
          <div className={Styles.sectionCard}>
            <div className={Styles.sectionHeader}>
              <h2>
                <FaBullseye className={Styles.sectionIcon} />
                Advanced Features
              </h2>
              <p>Explore the powerful tools exclusive to Pro users</p>
            </div>
            <div className={Styles.sectionBody}>
              <div className={Styles.featureGrid}>
                <div 
                  className={`${Styles.featureCard} ${activeSection === 'trading' ? Styles.active : ''}`}
                  onClick={() => toggleSection('trading')}
                >
                  <div className={Styles.featureHeader}>
                    <FaPlus className={Styles.featureIcon} />
                    <h3>Unlimited Trade Management</h3>
                  </div>
                  {activeSection === 'trading' && (
                    <div className={Styles.featureDetails}>
                      <ul>
                        <li>Add unlimited trades with complete details</li>
                        <li>Advanced trade categorization and tagging</li>
                        <li>Bulk import/export functionality</li>
                        <li>Real-time P&L tracking across all positions</li>
                        <li>Advanced search and filtering options</li>
                      </ul>
                    </div>
                  )}
                </div>

                <div 
                  className={`${Styles.featureCard} ${activeSection === 'analytics' ? Styles.active : ''}`}
                  onClick={() => toggleSection('analytics')}
                >
                  <div className={Styles.featureHeader}>
                    <FaChartLine className={Styles.featureIcon} />
                    <h3>Advanced Analytics</h3>
                  </div>
                  {activeSection === 'analytics' && (
                    <div className={Styles.featureDetails}>
                      <ul>
                        <li>Interactive performance charts and graphs</li>
                        <li>Advanced risk-reward ratio analysis</li>
                        <li>Detailed monthly and yearly reports</li>
                        <li>Symbol-wise and strategy-wise breakdowns</li>
                        <li>Custom date range analysis</li>
                      </ul>
                    </div>
                  )}
                </div>

                <div 
                  className={`${Styles.featureCard} ${activeSection === 'risk' ? Styles.active : ''}`}
                  onClick={() => toggleSection('risk')}
                >
                  <div className={Styles.featureHeader}>
                    <FaShieldAlt className={Styles.featureIcon} />
                    <h3>Risk Management Tools</h3>
                  </div>
                  {activeSection === 'risk' && (
                    <div className={Styles.featureDetails}>
                      <ul>
                        <li>Real-time risk exposure monitoring</li>
                        <li>Risk breach alerts and notifications</li>
                        <li>Position sizing recommendations</li>
                        <li>Portfolio risk distribution analysis</li>
                        <li>Advanced stop-loss and target optimization</li>
                      </ul>
                    </div>
                  )}
                </div>

                <div 
                  className={`${Styles.featureCard} ${activeSection === 'psychology' ? Styles.active : ''}`}
                  onClick={() => toggleSection('psychology')}
                >
                  <div className={Styles.featureHeader}>
                    <FaFileAlt className={Styles.featureIcon} />
                    <h3>Trading Psychology AI</h3>
                  </div>
                  {activeSection === 'psychology' && (
                    <div className={Styles.featureDetails}>
                      <ul>
                        <li>Track confidence levels and emotional states</li>
                        <li>AI-powered psychology pattern analysis</li>
                        <li>Mistake tracking and learning insights</li>
                        <li>Satisfaction ratings and improvement tips</li>
                        <li>Personalized psychology coaching</li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className={Styles.sectionCard}>
            <div className={Styles.sectionHeader}>
              <h2>
                <FaHeadset className={Styles.sectionIcon} />
                Pro Subscriber FAQs
              </h2>
              <p>Common questions from our Pro users</p>
            </div>
            <div className={Styles.sectionBody}>
              <div className={Styles.faqPreview}>
                {faqData.slice(0, 3).map((faq, index) => (
                  <div key={index} className={Styles.faqItem}>
                    <h4>{faq.question}</h4>
                    <p>{faq.answer}</p>
                  </div>
                ))}
              </div>
              <button 
                className={Styles.primaryButton}
                onClick={() => setShowFAQModal(true)}
              >
                View All Pro FAQs
              </button>
            </div>
          </div>

          {/* Pro Support Section */}
          <div className={Styles.sectionCard}>
            <div className={Styles.sectionHeader}>
              <h2>
                <FaHeadset className={Styles.sectionIcon} />
                Priority Pro Support
              </h2>
              <p>Get help from our trading experts</p>
            </div>
            <div className={Styles.sectionBody}>
              <div className={Styles.supportGrid}>
                <div className={Styles.supportCard}>
                  <h3>24/7 Live Chat</h3>
                  <p>Instant support from trading experts</p>
                  <div className={Styles.supportStatus}>
                    <span className={Styles.statusDot}></span>
                    Available Now
                  </div>
                  <p>Coming soon</p>
                </div>
                <div className={Styles.supportCard}>
                  <h3>Priority Email</h3>
                  <p>Response within 2 hours guaranteed</p>
                  <a href="mailto:pro@tradejournalai.com" className={Styles.supportLink}>
                    pro@tradejournalai.com
                  </a>
                </div>
                <div className={Styles.supportCard}>
                  <h3>Expert Consultation</h3>
                  <p>One-on-one trading strategy sessions</p>
                  <span className={Styles.supportBadge}>Schedule Call</span>
                  <p>Coming soon</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Modal */}
      {showFAQModal && (
        <div className={Styles.modalOverlay}>
          <div className={Styles.modal}>
            <div className={Styles.modalHeader}>
              <h2>Pro Subscriber FAQs</h2>
              <button 
                className={Styles.closeButton}
                onClick={() => setShowFAQModal(false)}
              >
                <IoClose />
              </button>
            </div>
            <div className={Styles.modalBody}>
              <div className={Styles.faqList}>
                {faqData.map((faq, index) => (
                  <div key={index} className={Styles.faqModalItem}>
                    <h4>{faq.question}</h4>
                    <p>{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Help;
