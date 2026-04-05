import React, { useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { generateId } from "../../utils/helpers";
import { CATEGORY_META } from "../../data/transactions";
import styles from "./Modal.module.css";

const CATEGORIES = Object.keys(CATEGORY_META);

export default function AddEditModal({ transaction, onClose }) {
  const { addTransaction, updateTransaction } = useAppContext();
  const isEditing = !!transaction;

  const [form, setForm] = useState({
    date: transaction?.date || new Date().toISOString().split("T")[0],
    description: transaction?.description || "",
    category: transaction?.category || "Food",
    type: transaction?.type || "expense",
    amount: transaction?.amount || "",
  });

  const [errors, setErrors] = useState({});

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  }

  function validate() {
    const newErrors = {};
    if (!form.description.trim())
      newErrors.description = "Description is required";
    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0) {
      newErrors.amount = "Enter a valid amount";
    }
    if (!form.date) newErrors.date = "Date is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit() {
    if (!validate()) return;

    const txData = {
      ...form,
      amount: parseFloat(form.amount),
      id: transaction?.id || generateId(),
    };

    if (isEditing) {
      updateTransaction(txData);
    } else {
      addTransaction(txData);
    }

    onClose();
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            {isEditing ? "Edit Transaction" : "Add Transaction"}
          </h2>
          <button className={styles.closeBtn} onClick={onClose}>
            ✕
          </button>
        </div>

        <div className={styles.formRow}>
          <label className={styles.label}>Date</label>
          <input
            type="date"
            className={`${styles.input} ${errors.date ? styles.inputError : ""}`}
            value={form.date}
            onChange={(e) => handleChange("date", e.target.value)}
          />
          {errors.date && <p className={styles.errorMsg}>{errors.date}</p>}
        </div>

        <div className={styles.formRow}>
          <label className={styles.label}>Description</label>
          <input
            type="text"
            className={`${styles.input} ${errors.description ? styles.inputError : ""}`}
            placeholder="e.g. Grocery Store"
            value={form.description}
            onChange={(e) => handleChange("description", e.target.value)}
          />
          {errors.description && (
            <p className={styles.errorMsg}>{errors.description}</p>
          )}
        </div>

        <div className={styles.formRow}>
          <label className={styles.label}>Category</label>
          <select
            className={styles.input}
            value={form.category}
            onChange={(e) => handleChange("category", e.target.value)}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.formRow}>
          <label className={styles.label}>Type</label>
          <div className={styles.typeToggle}>
            <button
              className={`${styles.typeBtn} ${form.type === "expense" ? styles.expenseActive : ""}`}
              onClick={() => handleChange("type", "expense")}
            >
              ↓ Expense
            </button>
            <button
              className={`${styles.typeBtn} ${form.type === "income" ? styles.incomeActive : ""}`}
              onClick={() => handleChange("type", "income")}
            >
              ↑ Income
            </button>
          </div>
        </div>

        <div className={styles.formRow}>
          <label className={styles.label}>Amount (₹)</label>
          <input
            type="number"
            className={`${styles.input} ${errors.amount ? styles.inputError : ""}`}
            placeholder="0"
            min="0"
            value={form.amount}
            onChange={(e) => handleChange("amount", e.target.value)}
          />
          {errors.amount && <p className={styles.errorMsg}>{errors.amount}</p>}
        </div>

        <div className={styles.modalActions}>
          <button className={styles.cancelBtn} onClick={onClose}>
            Cancel
          </button>
          <button className={styles.submitBtn} onClick={handleSubmit}>
            {isEditing ? "Update" : "Add Transaction"}
          </button>
        </div>
      </div>
    </div>
  );
}
