import React from "react";
import { useAppContext } from "../../context/AppContext";
import { useFilteredTransactions } from "../../hooks/useFilteredTransactions";
import styles from "./Transactions.module.css";

export default function TransactionFilters() {
  const { filters, updateFilter } = useAppContext();
  const { allCategories } = useFilteredTransactions();

  return (
    <div className={styles.filtersRow}>
      <input
        type="text"
        className={styles.filterInput}
        placeholder="Search transactions..."
        value={filters.search}
        onChange={(e) => updateFilter("search", e.target.value)}
      />

      <select
        className={styles.filterSelect}
        value={filters.type}
        onChange={(e) => updateFilter("type", e.target.value)}
      >
        <option value="all">All Types</option>
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>

      <select
        className={styles.filterSelect}
        value={filters.category}
        onChange={(e) => updateFilter("category", e.target.value)}
      >
        {allCategories.map((cat) => (
          <option key={cat} value={cat}>
            {cat === "all" ? "All Categories" : cat}
          </option>
        ))}
      </select>

      {(filters.search ||
        filters.type !== "all" ||
        filters.category !== "all") && (
        <button
          className={styles.clearBtn}
          onClick={() => {
            updateFilter("search", "");
            updateFilter("type", "all");
            updateFilter("category", "all");
          }}
        >
          ✕ Clear
        </button>
      )}
    </div>
  );
}
