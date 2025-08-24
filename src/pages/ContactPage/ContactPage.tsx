import React, { useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import { FilledButton } from '../../components/Button/Button';
import Styles from './ContactPage.module.css';

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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Basic form validation
    if (!formData.fullName || !formData.email || !formData.message) {
      setFormStatus({
        sent: false,
        error: true,
        message: 'Please fill out all fields.'
      });
      return;
    }

    // In a real application, you would send this data to a server
    console.log('Form Submitted:', formData);
    
    // Simulate a successful submission
    setFormStatus({
      sent: true,
      error: false,
      message: 'Your message has been sent successfully!'
    });

    // Clear the form after a successful submission
    setFormData({
      fullName: '',
      email: '',
      message: ''
    });

    // Reset the status message after a few seconds
    setTimeout(() => {
      setFormStatus({ sent: false, error: false, message: '' });
    }, 5000);
  };

  return (
    <div className={Styles.contactPageContainer}>
      <div className={Styles.navbarContainer}><Navbar /></div>
      <main className={Styles.contentWrapper}>
        <section className={Styles.contactSection}>
          <div className={Styles.headingContainer}>
            <h1 className={Styles.mainHeading}>Get in Touch</h1>
            <p className={Styles.subHeading}>
              Have a question, feedback, or need support? Send us a message and we'll get back to you as soon as possible.
            </p>
          </div>
          <div className={Styles.contactFormContainer}>
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
                <p className={Styles.infoText}>+1 (555) 123-4567</p>
              </div>
              <div className={Styles.infoBlock}>
                <p className={Styles.infoLabel}>Socials</p>
                <p className={Styles.infoText}>@tradeJournal</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <div className={Styles.footerContainer}><Footer /></div>
    </div>
  );
};

export default ContactPage;