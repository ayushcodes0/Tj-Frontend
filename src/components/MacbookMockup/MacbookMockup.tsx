// src/components/MacBookMockup/MacBookMockup.tsx

import React from 'react';
import Styles from './MacBookMockup.module.css';

interface MacBookMockupProps {
  imageUrl: string;
  altText?: string;
  className?: string;
}

const MacBookMockup: React.FC<MacBookMockupProps> = ({
  imageUrl,
  altText = "Application preview",
  className = ""
}) => {
  return (
    <div className={`${Styles.deviceContainer} ${className}`}>
      <div className={Styles.macbook}>
        {/* The screen part of the laptop */}
        <div className={Styles.screen}>
          <div className={Styles.bezel}>
            <img src={imageUrl} alt={altText} className={Styles.content} />
            <div className={Styles.reflection}></div>
          </div>
          <div className={Styles.notch}>
            <div className={Styles.camera}></div>
          </div>
        </div>

        {/* The base of the laptop */}
        <div className={Styles.base}>
          <div className={Styles.indent}></div>
        </div>
      </div>
      <div className={Styles.shadow}></div>
    </div>
  );
};

export default MacBookMockup;
