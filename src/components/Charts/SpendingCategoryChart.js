import React, { useEffect, useRef, useMemo } from "react";
import { Chart } from "chart.js/auto";
import { useAppContext } from "../../context/AppContext";
import { getExpensesByCategory } from "../../utils/helpers";
import { CATEGORY_META } from "../../data/transactions";
import styles from "./Charts.module.css";

export default function SpendingCategoryChart() {
  const { transactions } = useAppContext();
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  const categoryData = useMemo(() => {
    const entries = getExpensesByCategory(transactions);
    return {
      labels: entries.map((e) => e.name),
      data: entries.map((e) => e.amount),
      colors: entries.map((e) => CATEGORY_META[e.name]?.color || "#888"),
    };
  }, [transactions]);

  const total = categoryData.data.reduce((sum, v) => sum + v, 0);

  useEffect(() => {
    if (!canvasRef.current) return;
    if (chartRef.current) chartRef.current.destroy();

    chartRef.current = new Chart(canvasRef.current, {
      type: "doughnut",
      data: {
        labels: categoryData.labels,
        datasets: [
          {
            data: categoryData.data,
            backgroundColor: categoryData.colors.map((c) => c + "cc"),
            borderColor: "#161820",
            borderWidth: 2,
            hoverOffset: 8,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "65%",
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "#1e2030",
            borderColor: "rgba(255,255,255,0.1)",
            borderWidth: 1,
            titleColor: "#9094b0",
            bodyColor: "#e8eaf6",
            callbacks: {
              label: (ctx) => {
                const pct =
                  total > 0 ? ((ctx.raw / total) * 100).toFixed(1) : 0;
                return (
                  "  ₹" + ctx.raw.toLocaleString("en-IN") + " (" + pct + "%)"
                );
              },
            },
          },
        },
      },
    });

    return () => {
      if (chartRef.current) chartRef.current.destroy();
    };
  }, [categoryData]);

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div>
          <h3 className={styles.cardTitle}>Spending Breakdown</h3>
          <p className={styles.cardSub}>By category</p>
        </div>
      </div>

      {categoryData.data.length === 0 ? (
        <div className={styles.empty}>No expense data</div>
      ) : (
        <>
          <div className={styles.chartWrap} style={{ height: "190px" }}>
            <canvas ref={canvasRef} />
          </div>

          <div className={styles.legend}>
            {categoryData.labels.slice(0, 6).map((label, i) => {
              const pct =
                total > 0
                  ? ((categoryData.data[i] / total) * 100).toFixed(0)
                  : 0;
              return (
                <div key={label} className={styles.legendItem}>
                  <span
                    className={styles.legendDot}
                    style={{ background: categoryData.colors[i] }}
                  />
                  <span className={styles.legendName}>{label}</span>
                  <span className={styles.legendPct}>{pct}%</span>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
