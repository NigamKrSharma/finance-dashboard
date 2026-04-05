import React, { useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { useFilteredTransactions } from "../../hooks/useFilteredTransactions";
import TransactionFilters from "./TransactionFilters";
import TransactionTable from "./TransactionTable";
import AddEditModal from "../Modal/AddEditModal";
import styles from "./Transactions.module.css";

export default function TransactionsPage() {
  const { role, transactions, deleteTransaction } = useAppContext();
  const { filtered } = useFilteredTransactions();

  const [showModal, setShowModal] = useState(false);
  const [editingTx, setEditingTx] = useState(null);

  function handleEdit(tx) {
    setEditingTx(tx);
    setShowModal(true);
  }

  function handleAdd() {
    setEditingTx(null);
    setShowModal(true);
  }

  function handleDelete(id) {
    if (window.confirm("Delete this transaction?")) {
      deleteTransaction(id);
    }
  }

  function handleExportCSV() {
    const headers = ["Date", "Description", "Category", "Type", "Amount"];
    const rows = filtered.map((tx) => [
      tx.date,
      `"${tx.description}"`,
      tx.category,
      tx.type,
      tx.amount,
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "transactions.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <div className={styles.sectionHeader}>
        <div>
          <h2 className={styles.sectionTitle}>All Transactions</h2>
          <p className={styles.sectionCount}>
            Showing {filtered.length} of {transactions.length} transactions
          </p>
        </div>

        <div className={styles.headerActions}>
          <button className={styles.exportBtn} onClick={handleExportCSV}>
            ↓ Export CSV
          </button>

          {role === "admin" && (
            <button className={styles.addBtn} onClick={handleAdd}>
              + Add Transaction
            </button>
          )}
        </div>
      </div>

      <TransactionFilters />

      <TransactionTable onEdit={handleEdit} onDelete={handleDelete} />

      {showModal && (
        <AddEditModal
          transaction={editingTx}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
