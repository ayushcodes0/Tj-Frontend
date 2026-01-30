import React, { useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import { FilledButton } from '../../components/Button/Button';
import Styles from './ContactPage.module.css';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';

// Define the types for the state objects
interface FormData {
  fullName: string;
  email: string;
  message: string;
}

interface FormStatus {
  sent: boolean;
  error: boolean;
  message: string;
}

// Define animation variants for a modern feel
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const fadeUpItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      ease: [0.16, 0.77, 0.47, 0.97],
      duration: 0.6
    }
  }
};

const ContactPage = () => {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    message: ''
  });

  const [formStatus, setFormStatus] = useState<FormStatus>({
    sent: false,
    error: false,
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.fullName || !formData.email || !formData.message) {
      setFormStatus({
        sent: false,
        error: true,
        message: 'Please fill out all fields.'
      });
      return;
    }

    // Indicate that the form is being submitted
    setFormStatus({
      sent: false,
      error: false,
      message: 'Sending...'
    });

    try {
      const apiUrl = `${import.meta.env.VITE_API_URL}/contact`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok && result.status === 'success') {
        setFormStatus({
          sent: true,
          error: false,
          message: result.message
        });
        setFormData({ fullName: '', email: '', message: '' });
      } else {
        setFormStatus({
          sent: false,
          error: true,
          message: result.message || 'Failed to send message. Please try again later.'
        });
      }
    } catch (error) {
      console.error('Submission error:', error);
      setFormStatus({
        sent: false,
        error: true,
        message: 'An unexpected error occurred. Please try again later.'
      });
    }

    // Reset the status message after a few seconds
    setTimeout(() => {
      setFormStatus({ sent: false, error: false, message: '' });
    }, 5000);
  };

  return (
    <div className={Styles.contactPageContainer}>
      <div className={Styles.navbarContainer}><Navbar /></div>
      <main className={Styles.contentWrapper}>
        <motion.section 
          className={Styles.contactSection}
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div className={Styles.headingContainer} variants={fadeUpItem}>
            <h1 className={Styles.mainHeading}>Get in Touch</h1>
            <p className={Styles.subHeading}>
              Have a question, feedback, or need support? Send us a message and we'll get back to you as soon as possible.
            </p>
          </motion.div>
          <motion.div className={Styles.contactFormContainer} variants={fadeUpItem}>
            <form onSubmit={handleSubmit} className={Styles.contactForm}>
              <div className={Styles.formGroup}>
                <label htmlFor="fullName" className={Styles.label}>Full Name</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={Styles.input}
                />
              </div>
              <div className={Styles.formGroup}>
                <label htmlFor="email" className={Styles.label}>Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={Styles.input}
                />
              </div>
              <div className={Styles.formGroup}>
                <label htmlFor="message" className={Styles.label}>Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className={`${Styles.input} ${Styles.textarea}`}
                />
              </div>
              <FilledButton text="Send Message" />
              {formStatus.message && (
                <p className={
                  formStatus.error 
                    ? Styles.errorMessage 
                    : Styles.successMessage
                }>
                  {formStatus.message}
                </p>
              )}
            </form>
            <div className={Styles.contactInfo}>
              <h3 className={Styles.infoHeading}>Our Details</h3>
              <div className={Styles.infoBlock}>
                <p className={Styles.infoLabel}>Email</p>
                <p className={Styles.infoText}>support@tradejournal.com</p>
              </div>
              <div className={Styles.infoBlock}>
                <p className={Styles.infoLabel}>Phone</p>
                <p className={Styles.infoText}>9339682864</p>
              </div>
              <div className={Styles.infoBlock}>
                <p className={Styles.infoLabel}>Socials</p>
                <p className={Styles.infoText}>@tradeJournal</p>
              </div>
            </div>
          </motion.div>
        </motion.section>
      </main>
      <div className={Styles.footerContainer}><Footer /></div>
    </div>
  );
};

export default ContactPage;