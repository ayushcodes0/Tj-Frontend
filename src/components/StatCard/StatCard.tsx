import Styles from "../Calendar/Calendar.module.css";

const StatCard = ({
  label,
  value,
  positive,
}: {
  label: string;
  value: string | number;
  positive: boolean;
}) => (
  <div className={Styles.statCard}>
    <span className={Styles.statCardLabel}>{label}</span>
    <span className={positive ? Styles.statCardValuePos : Styles.statCardValueNeg}>
      {value}
    </span>
  </div>
);

export default StatCard;
