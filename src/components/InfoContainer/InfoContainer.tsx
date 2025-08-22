import type { ReactNode } from "react";
import Styles from "./InfoContainer.module.css";
import { FilledButton, UnfilledButton } from "../Button/Button";
import { Link } from "react-router-dom"; // Import Link from react-router-dom

type InfoPoint = {
  icon: ReactNode;
  text: string;
};

type InfoContainerProps = {
  tags?: string[];
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
          {/* Use Link to wrap FilledButton and navigate to /login */}
          <Link to="/login" className={Styles.buttonLink}>
            <FilledButton text={primaryButtonText} />
          </Link>
          {/* Use Link to wrap UnfilledButton and navigate to /pricing */}
          <Link to="/pricing#pricing" className={Styles.buttonLink}>
            <UnfilledButton text={secondaryButtonText} />
          </Link>
        </div>
        <p className={Styles.buttonSmallText}>{buttonSmallText}</p>
      </div>
    </div>
  );
};

export default InfoContainer;