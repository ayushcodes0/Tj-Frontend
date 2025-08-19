// src/components/IphoneMockup/IphoneMockup.tsx

import React from 'react';
import Styles from './IphoneMockup.module.css';

interface IphoneMockupProps {
  imageUrl: string;
  altText?: string;
  className?: string;
}

const IphoneMockup: React.FC<IphoneMockupProps> = ({
  imageUrl,
  altText = "Application preview on mobile",
  className = ""
}) => {
  return (
    <div className={`${Styles.deviceContainer} ${className}`}>
      <div className={Styles.iphone}>
        {/* The main screen area */}
        <div className={Styles.screen}>
          <div className={Styles.bezel}>
            <img src={imageUrl} alt={altText} className={Styles.content} />
            <div className={Styles.reflection}></div>
          </div>
        </div>
        
        {/* The Dynamic Island / Notch */}
        <div className={Styles.dynamicIsland}></div>
        
        {/* Side buttons for realism */}
        <div className={`${Styles.sideButton} ${Styles.volumeUp}`}></div>
        <div className={`${Styles.sideButton} ${Styles.volumeDown}`}></div>
        <div className={`${Styles.sideButton} ${Styles.power}`}></div>
      </div>
      <div className={Styles.shadow}></div>
    </div>
  );
};

export default IphoneMockup;
