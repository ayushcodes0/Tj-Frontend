import { useEffect, useState } from "react";
import { useTrades } from "../../hooks/useTrade";
import TradesTable from "../../components/TradesTable/TradesTable";
import Styles from "./Trades.module.css";
import { GrPrevious, GrNext } from "react-icons/gr";

// Simple pagination button bar
const Pagination = ({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) => (
  <div className={Styles.pagination}>
    <button
      className={Styles.buttons}
      onClick={() => onPageChange(page - 1)}
      disabled={page <= 1}
    >
      <GrPrevious />
    </button>
    <span>
      Page {page} of {totalPages}
    </span>
    <button
      className={Styles.buttons}
      onClick={() => onPageChange(page + 1)}
      disabled={page >= totalPages}
    >
      <GrNext />
    </button>
  </div>
);

const PAGE_SIZE = 15;

const Trades = () => {
  const { trades, loading, error, fetchTrades, meta } = useTrades();
  const [page, setPage] = useState(1);

  // Always fetch with 'lifetime' filter, paginated
  useEffect(() => {
    fetchTrades("lifetime", { page, limit: PAGE_SIZE });
  }, [fetchTrades, page]);

  const transformedTrades =
    trades?.map(trade => ({
      ...trade,
      entry_price: trade.entry_price ?? 0,
      exit_price: trade.exit_price ?? 0,
      pnl_amount: trade.pnl_amount ?? 0,
      pnl_percentage: trade.pnl_percentage ?? 0,
    })) ?? [];

  return (
    <div className={Styles.tradeContainer}>
      <div className={Styles.tradesHeader}>
        <p className={Styles.allTrades}>All Trades</p>
        {meta && meta.totalPages > 1 && (
          <Pagination
            page={meta.page}
            totalPages={meta.totalPages}
            onPageChange={setPage}
          />
        )}
      </div>

      {loading && <div>Loading trades...</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}

      {transformedTrades.length > 0 ? (
        <TradesTable trades={transformedTrades} />
      ) : (
        !loading && <div>No trades found.</div>
      )}
    </div>
  );
};

export default Trades;
