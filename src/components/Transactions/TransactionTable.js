import React from "react";
import { useAppContext } from "../../context/AppContext";
import { useFilteredTransactions } from "../../hooks/useFilteredTransactions";
import { formatDate, formatMoney } from "../../utils/helpers";
import { CATEGORY_META } from "../../data/transactions";
import styles from "./Transactions.module.css";

const COLUMNS = [
  { key: "date", label: "Date", sortable: true },
  { key: "description", label: "Description", sortable: false },
  { key: "category", label: "Category", sortable: true },
  { key: "type", label: "Type", sortable: true },
  { key: "amount", label: "Amount", sortable: true },
];

export default function TransactionTable({ onEdit, onDelete }) {
  const { role, sort, updateSort } = useAppContext();
  const { filtered } = useFilteredTransactions();

  function SortArrow({ field }) {
    if (sort.field !== field)
      return <span className={styles.sortArrow}>⇅</span>;
    return (
      <span className={styles.sortArrow}>{sort.dir === "asc" ? "↑" : "↓"}</span>
    );
  }

  if (filtered.length === 0) {
    return (
      <div className={styles.emptyState}>
        <span className={styles.emptyIcon}>◎</span>
        <p className={styles.emptyText}>No transactions match your filters.</p>
        <p className={styles.emptyHint}>
          Try changing your search or filter options.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            {COLUMNS.map((col) => (
              <th
                key={col.key}
                className={`${styles.th} ${col.sortable ? styles.sortable : ""}`}
                onClick={() => col.sortable && updateSort(col.key)}
              >
                {col.label}
                {col.sortable && <SortArrow field={col.key} />}
              </th>
            ))}

            {role === "admin" && <th className={styles.th}>Actions</th>}
          </tr>
        </thead>

        <tbody>
          {filtered.map((tx) => {
            const catMeta = CATEGORY_META[tx.category] || {
              color: "#888",
              bg: "rgba(136,136,136,0.15)",
            };
            return (
              <tr key={tx.id} className={styles.tr}>
                <td className={styles.td}>{formatDate(tx.date)}</td>
                <td className={styles.td}>{tx.description}</td>

                <td className={styles.td}>
                  <span
                    className={styles.catBadge}
                    style={{ background: catMeta.bg, color: catMeta.color }}
                  >
                    {tx.category}
                  </span>
                </td>

                <td className={styles.td}>
                  <span className={`${styles.typeBadge} ${styles[tx.type]}`}>
                    {tx.type === "income" ? "↑" : "↓"} {tx.type}
                  </span>
                </td>

                <td className={styles.td}>
                  <span className={`${styles.amount} ${styles[tx.type]}`}>
                    {tx.type === "income" ? "+" : "−"} {formatMoney(tx.amount)}
                  </span>
                </td>

                {role === "admin" && (
                  <td className={styles.td}>
                    <div className={styles.actionBtns}>
                      <button
                        className={styles.editBtn}
                        onClick={() => onEdit(tx)}
                      >
                        Edit
                      </button>
                      <button
                        className={styles.deleteBtn}
                        onClick={() => onDelete(tx.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
