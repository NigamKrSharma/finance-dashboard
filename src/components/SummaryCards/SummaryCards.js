import React from "react";
import { useAppContext } from "../../context/AppContext";
import { calcTotals, formatMoney } from "../../utils/helpers";
import styles from "./SummaryCards.module.css";

function StatCard({ label, value, icon, accentColor, changeText, changeUp }) {
  return (
    <div className={styles.card}>
      <div className={styles.accent} style={{ background: accentColor }} />

      <div className={styles.cardBody}>
        <div className={styles.iconWrapper} style={{ color: accentColor }}>
          {icon}
        </div>
        <p className={styles.label}>{label}</p>
        <p className={styles.value} style={{ color: accentColor }}>
          {value}
        </p>
        {changeText && (
          <p
            className={`${styles.change} ${changeUp ? styles.up : styles.down}`}
          >
            {changeUp ? "▲" : "▼"} {changeText}
          </p>
        )}
      </div>
    </div>
  );
}

export default function SummaryCards() {
  const { transactions } = useAppContext();
  const { income, expense, balance } = calcTotals(transactions);

  const incomeCount = transactions.filter((t) => t.type === "income").length;
  const expenseCount = transactions.filter((t) => t.type === "expense").length;

  return (
    <div className={styles.grid}>
      <StatCard
        label="Total Balance"
        value={formatMoney(balance)}
        icon="◈"
        accentColor="#6c63ff"
        changeText={`${transactions.length} transactions`}
        changeUp={balance >= 0}
      />

      <StatCard
        label="Total Income"
        value={formatMoney(income)}
        icon="↑"
        accentColor="#3dd68c"
        changeText={`${incomeCount} income entries`}
        changeUp={true}
      />

      <StatCard
        label="Total Expenses"
        value={formatMoney(expense)}
        icon="↓"
        accentColor="#f76565"
        changeText={`${expenseCount} expense entries`}
        changeUp={false}
      />

      <StatCard
        label="Savings Rate"
        value={
          income > 0
            ? (((income - expense) / income) * 100).toFixed(1) + "%"
            : "0%"
        }
        icon="★"
        accentColor="#f9a825"
        changeText={income > expense ? "Good savings!" : "Overspending"}
        changeUp={income > expense}
      />
    </div>
  );
}
