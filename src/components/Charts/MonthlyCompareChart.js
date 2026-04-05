import React, { useEffect, useRef, useMemo } from "react";
import { Chart } from "chart.js/auto";
import { useAppContext } from "../../context/AppContext";
import { getMonthlyData } from "../../utils/helpers";
import styles from "./Charts.module.css";

export default function MonthlyCompareChart() {
  const { transactions } = useAppContext();
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  const monthlyData = useMemo(
    () => getMonthlyData(transactions),
    [transactions],
  );

  useEffect(() => {
    if (!canvasRef.current) return;
    if (chartRef.current) chartRef.current.destroy();

    chartRef.current = new Chart(canvasRef.current, {
      type: "bar",
      data: {
        labels: monthlyData.labels,
        datasets: [
          {
            label: "Income",
            data: monthlyData.income,
            backgroundColor: "rgba(61,214,140,0.75)",
            borderColor: "#3dd68c",
            borderWidth: 1,
            borderRadius: 5,
          },
          {
            label: "Expenses",
            data: monthlyData.expense,
            backgroundColor: "rgba(247,101,101,0.75)",
            borderColor: "#f76565",
            borderWidth: 1,
            borderRadius: 5,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "#1e2030",
            borderColor: "rgba(255,255,255,0.1)",
            borderWidth: 1,
            titleColor: "#9094b0",
            bodyColor: "#e8eaf6",
            callbacks: {
              label: (ctx) =>
                "  " +
                ctx.dataset.label +
                ": ₹" +
                ctx.raw.toLocaleString("en-IN"),
            },
          },
        },
        scales: {
          x: {
            ticks: { color: "#5c6080", font: { size: 11 } },
            grid: { color: "rgba(255,255,255,0.04)" },
          },
          y: {
            ticks: {
              color: "#5c6080",
              font: { size: 11 },
              callback: (v) => "₹" + (v / 1000).toFixed(0) + "k",
            },
            grid: { color: "rgba(255,255,255,0.04)" },
          },
        },
      },
    });

    return () => {
      if (chartRef.current) chartRef.current.destroy();
    };
  }, [monthlyData]);

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div>
          <h3 className={styles.cardTitle}>Monthly Comparison</h3>
          <p className={styles.cardSub}>Income vs Expenses</p>
        </div>

        {/* Chart legend */}
        <div className={styles.legendRow}>
          <div className={styles.legendItem}>
            <span
              className={styles.legendDot}
              style={{ background: "#3dd68c" }}
            />
            <span>Income</span>
          </div>
          <div className={styles.legendItem}>
            <span
              className={styles.legendDot}
              style={{ background: "#f76565" }}
            />
            <span>Expenses</span>
          </div>
        </div>
      </div>

      {transactions.length === 0 ? (
        <div className={styles.empty}>No data to display</div>
      ) : (
        <div className={styles.chartWrap} style={{ height: "200px" }}>
          <canvas ref={canvasRef} />
        </div>
      )}
    </div>
  );
}
