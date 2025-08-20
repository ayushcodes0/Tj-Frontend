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
        {/* The side buttons for realism */}
        <div className={`${Styles.sideButton} ${Styles.volumeUp}`}></div>
        <div className={`${Styles.sideButton} ${Styles.volumeDown}`}></div>
        <div className={`${Styles.sideButton} ${Styles.silentSwitch}`}></div>
        <div className={`${Styles.sideButton} ${Styles.power}`}></div>

        {/* The main phone body and screen */}
        <div className={Styles.chassis}>
          <div className={Styles.screen}>
            <img src={imageUrl} alt={altText} className={Styles.content} />
          </div>
          <div className={Styles.dynamicIsland}>
            <div className={Styles.camera}></div>
          </div>
          <div className={Styles.gloss}></div>
        </div>
      </div>
    </div>
  );
};

export default IphoneMockup;
