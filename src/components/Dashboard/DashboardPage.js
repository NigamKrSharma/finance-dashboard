import React from "react";
import SummaryCards from "../SummaryCards/SummaryCards";
import BalanceTrendChart from "../Charts/BalanceTrendChart";
import SpendingCategoryChart from "../Charts/SpendingCategoryChart";
import MonthlyCompareChart from "../Charts/MonthlyCompareChart";
import styles from "./Dashboard.module.css";

export default function DashboardPage() {
  return (
    <div>
      <SummaryCards />

      <div className={styles.chartsGrid}>
        <BalanceTrendChart />
      </div>

      <div className={styles.chartsRow}>
        <SpendingCategoryChart />
        <MonthlyCompareChart />
      </div>
    </div>
  );
}
