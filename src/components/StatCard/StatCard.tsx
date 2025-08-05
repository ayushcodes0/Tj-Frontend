import Styles from "../Calendar/Calendar.module.css";

const StatCard = ({
  label,
  value,
  positive,
  delta,
}: {
  label: string;
  value: string | number;
  positive: boolean;
  delta?: number;
}) => (
  <div className={Styles.statCard}>
    <div className={Styles.stateCardData}>
        <span className={Styles.statCardLabel}>{label}</span>
        <span className={positive ? Styles.statCardValuePos : Styles.statCardValueNeg}>
        {value}
        </span>
    </div>
    <div className={Styles.percentage}>
        {typeof delta === "number" && (
        <span className={delta >= 0 ? Styles.statCardDeltaUp : Styles.statCardDeltaDown}>
            {delta >= 0 ? "▲" : "▼"} {Math.abs(delta).toFixed(1)}%
        </span>
    )}
    </div>
  </div>
);

export default StatCard;
