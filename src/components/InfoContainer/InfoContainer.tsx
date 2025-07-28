import type { ReactNode } from "react";
import Styles from "./InfoContainer.module.css";
import { FilledButton, UnfilledButton } from "../Button/Button";

// Define types for your props
type InfoPoint = {
  icon: ReactNode;
  text: string;
};

type InfoContainerProps = {
  tags?: string[]; // Optional array of tags
  heading: string;
  subHeading: string;
  infoPara: string;
  points: InfoPoint[];
  primaryButtonText: string;
  secondaryButtonText: string;
  buttonSmallText: string;
};

const InfoContainer = ({
  tags = [],
  heading,
  subHeading,
  infoPara,
  points,
  primaryButtonText,
  secondaryButtonText,
  buttonSmallText,
}: InfoContainerProps) => {
  return (
    <div className={Styles.informationContainer}>
      {/* Dynamic Tags - only renders if tags exist */}
      {tags.length > 0 && (
        <div className={Styles.tagContainer}>
          {tags.map((tag, index) => (
            <p key={index} className={Styles.infoTopTag}>
              {tag}
            </p>
          ))}
        </div>
      )}

      <div className={Styles.infoTopHeading}>
        <p className={Styles.heading}>{heading}</p>
        <p className={Styles.subHeading}>{subHeading}</p>
      </div>

      <div className={Styles.infoTexts}>
        <p className={Styles.infoPara}>{infoPara}</p>
        <div className={Styles.infoPoints}>
          {points.map((point, index) => (
            <div key={index} className={Styles.points}>
              <div className={Styles.pointIcon}>{point.icon}</div>
              <p className={Styles.pointsText}>{point.text}</p>
            </div>
          ))}
        </div>
      </div>

      <div className={Styles.infoButtons}>
        <div className={Styles.buttons}>
          <FilledButton text={primaryButtonText} />
          <UnfilledButton text={secondaryButtonText} />
        </div>
        <p className={Styles.buttonSmallText}>{buttonSmallText}</p>
      </div>
    </div>
  );
};

export default InfoContainer;