import React, { useMemo } from "react";
import { useAppContext } from "../../context/AppContext";
import {
  formatMoney,
  getMonthLabel,
  getExpensesByCategory,
} from "../../utils/helpers";
import { CATEGORY_META } from "../../data/transactions";
import styles from "./Insights.module.css";

function InsightCard({ label, value, note, valueColor, icon }) {
  return (
    <div className={styles.insightCard}>
      <p className={styles.insightLabel}>
        {icon} {label}
      </p>
      <p
        className={styles.insightValue}
        style={{ color: valueColor || "var(--text)" }}
      >
        {value}
      </p>
      {note && <p className={styles.insightNote}>{note}</p>}
    </div>
  );
}

export default function InsightsPage() {
  const { transactions } = useAppContext();

  const insights = useMemo(() => {
    const expenses = transactions.filter((t) => t.type === "expense");
    const incomes = transactions.filter((t) => t.type === "income");

    const totalIncome = incomes.reduce((s, t) => s + t.amount, 0);
    const totalExpense = expenses.reduce((s, t) => s + t.amount, 0);
    const savingsRate =
      totalIncome > 0
        ? (((totalIncome - totalExpense) / totalIncome) * 100).toFixed(1)
        : 0;

    const catData = getExpensesByCategory(transactions);
    const topCat = catData[0] || { name: "N/A", amount: 0 };

    const biggestTx = [...expenses].sort((a, b) => b.amount - a.amount)[0] || {
      description: "N/A",
      amount: 0,
    };

    const monthNetMap = {};
    transactions.forEach((t) => {
      const m = getMonthLabel(t.date);
      if (!monthNetMap[m]) monthNetMap[m] = 0;
      monthNetMap[m] += t.type === "income" ? t.amount : -t.amount;
    });

    const monthEntries = Object.entries(monthNetMap);
    const bestMonth = monthEntries.sort((a, b) => b[1] - a[1])[0] || ["N/A", 0];
    const worstMonth = monthEntries.sort((a, b) => a[1] - b[1])[0] || [
      "N/A",
      0,
    ];

    const months = new Set(expenses.map((t) => getMonthLabel(t.date)));
    const avgMonthlyExp =
      months.size > 0 ? (totalExpense / months.size).toFixed(0) : 0;

    const catBreakdown = catData.slice(0, 6).map((c) => ({
      ...c,
      pct: totalExpense > 0 ? ((c.amount / totalExpense) * 100).toFixed(1) : 0,
    }));

    return {
      totalIncome,
      totalExpense,
      savingsRate,
      topCat,
      biggestTx,
      bestMonth,
      worstMonth,
      avgMonthlyExp,
      catBreakdown,
    };
  }, [transactions]);

  if (transactions.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p className={styles.emptyIcon}>◎</p>
        <p className={styles.emptyText}>No data available yet.</p>
        <p className={styles.emptyHint}>
          Add some transactions to see insights.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className={styles.cardsGrid}>
        <InsightCard
          icon="🔥"
          label="Top Spending Category"
          value={insights.topCat.name}
          note={formatMoney(insights.topCat.amount) + " total spent"}
          valueColor="var(--amber)"
        />
        <InsightCard
          icon="💰"
          label="Savings Rate"
          value={insights.savingsRate + "%"}
          note={
            Number(insights.savingsRate) >= 20
              ? "Great job saving!"
              : "Try to cut expenses"
          }
          valueColor={
            Number(insights.savingsRate) >= 20 ? "var(--green)" : "var(--red)"
          }
        />
        <InsightCard
          icon="📅"
          label="Best Month (Net)"
          value={insights.bestMonth[0]}
          note={"Net: " + formatMoney(insights.bestMonth[1])}
          valueColor="var(--green)"
        />
        <InsightCard
          icon="📉"
          label="Worst Month (Net)"
          value={insights.worstMonth[0]}
          note={"Net: " + formatMoney(insights.worstMonth[1])}
          valueColor="var(--red)"
        />
        <InsightCard
          icon="💸"
          label="Biggest Expense"
          value={insights.biggestTx.description}
          note={formatMoney(insights.biggestTx.amount)}
          valueColor="var(--text)"
        />
        <InsightCard
          icon="📊"
          label="Avg Monthly Expense"
          value={formatMoney(insights.avgMonthlyExp)}
          note="Average per month"
          valueColor="var(--teal)"
        />
      </div>

      <div className={styles.breakdownCard}>
        <div className={styles.breakdownHeader}>
          <h3 className={styles.breakdownTitle}>Spending by Category</h3>
          <p className={styles.breakdownSub}>Top expense categories</p>
        </div>

        <div className={styles.breakdownList}>
          {insights.catBreakdown.map((cat) => {
            const meta = CATEGORY_META[cat.name] || { color: "#888" };
            return (
              <div key={cat.name} className={styles.breakdownRow}>
                <div className={styles.breakdownInfo}>
                  <span className={styles.breakdownName}>{cat.name}</span>
                  <span
                    className={styles.breakdownAmt}
                    style={{ color: meta.color }}
                  >
                    {formatMoney(cat.amount)} ({cat.pct}%)
                  </span>
                </div>

                <div className={styles.progressBar}>
                  <div
                    className={styles.progressFill}
                    style={{ width: cat.pct + "%", background: meta.color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className={styles.observationsCard}>
        <h3 className={styles.breakdownTitle}>Key Observations</h3>
        <ul className={styles.obsList}>
          <li className={styles.obsItem}>
            Your savings rate is{" "}
            <strong
              style={{
                color:
                  Number(insights.savingsRate) >= 20
                    ? "var(--green)"
                    : "var(--red)",
              }}
            >
              {insights.savingsRate}%
            </strong>{" "}
            —{" "}
            {Number(insights.savingsRate) >= 20
              ? "you're on track financially."
              : "consider reducing non-essential spending."}
          </li>
          <li className={styles.obsItem}>
            <strong style={{ color: "var(--amber)" }}>
              {insights.topCat.name}
            </strong>{" "}
            is your biggest expense category at{" "}
            {formatMoney(insights.topCat.amount)}.
          </li>
          <li className={styles.obsItem}>
            Your best financial month was{" "}
            <strong style={{ color: "var(--green)" }}>
              {insights.bestMonth[0]}
            </strong>{" "}
            with a net gain of {formatMoney(insights.bestMonth[1])}.
          </li>
          <li className={styles.obsItem}>
            Average monthly expenses are{" "}
            <strong style={{ color: "var(--teal)" }}>
              {formatMoney(insights.avgMonthlyExp)}
            </strong>
            .
          </li>
        </ul>
      </div>
    </div>
  );
}
