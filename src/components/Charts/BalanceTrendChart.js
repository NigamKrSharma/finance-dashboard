import React, { useEffect, useRef } from "react";
import { Chart } from "chart.js/auto";
import { useAppContext } from "../../context/AppContext";
import { getCumulativeBalance } from "../../utils/helpers";
import styles from "./Charts.module.css";

export default function BalanceTrendChart() {
  const { transactions } = useAppContext();
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const { labels, data } = getCumulativeBalance(transactions);

    chartRef.current = new Chart(canvasRef.current, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "Balance",
            data,
            borderColor: "#6c63ff",
            backgroundColor: "rgba(108,99,255,0.08)",
            borderWidth: 2.5,
            pointBackgroundColor: "#8b83ff",
            pointBorderColor: "#161820",
            pointBorderWidth: 2,
            pointRadius: 5,
            pointHoverRadius: 7,
            fill: true,
            tension: 0.4,
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
            padding: 10,
            callbacks: {
              label: (ctx) => "  Balance: ₹" + ctx.raw.toLocaleString("en-IN"),
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
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [transactions]);

  return (
    <div className={`${styles.card} ${styles.fullWidth}`}>
      <div className={styles.cardHeader}>
        <div>
          <h3 className={styles.cardTitle}>Balance Trend</h3>
          <p className={styles.cardSub}>Cumulative balance over time</p>
        </div>
        <div className={styles.chartLegend}>
          <span
            className={styles.legendDot}
            style={{ background: "#6c63ff" }}
          />
          <span>Balance</span>
        </div>
      </div>

      {transactions.length === 0 ? (
        <div className={styles.empty}>No data to display</div>
      ) : (
        <div className={styles.chartWrap} style={{ height: "220px" }}>
          <canvas ref={canvasRef} />
        </div>
      )}
    </div>
  );
}
