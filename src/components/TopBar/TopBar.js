// src/components/TopBar/TopBar.js
import React from "react";
import { useAppContext } from "../../context/AppContext";
import styles from "./TopBar.module.css";


const PAGE_INFO = {
  dashboard:    { title: "Dashboard",     subtitle: "Financial overview for Q1 2024" },
  transactions: { title: "Transactions",  subtitle: "Browse and manage your transactions" },
  insights:     { title: "Insights",      subtitle: "Understand your spending patterns" },
};

export default function TopBar() {
  const { activeTab, role, setSidebarOpen, resetData } = useAppContext();

  const page = PAGE_INFO[activeTab] || PAGE_INFO.dashboard;

  return (
    <header className={styles.topbar}>
     
      <div className={styles.left}>
      
        <button
          className={styles.hamburger}
          onClick={() => setSidebarOpen(true)}
          aria-label="Open menu"
        >
          ☰
        </button>

        <div>
          <h1 className={styles.title}>{page.title}</h1>
          <p className={styles.subtitle}>{page.subtitle}</p>
        </div>
      </div>

      
      <div className={styles.right}>
     
        <div className={`${styles.rolePill} ${styles[role]}`}>
          <span className={styles.roleIcon}>{role === "admin" ? "🔑" : "👁"}</span>
          {role === "admin" ? "Admin Mode" : "Viewer Mode"}
        </div>

       
        <button
          className={styles.resetBtn}
          onClick={resetData}
          title="Reset to original mock data"
        >
          ↺ Reset
        </button>
      </div>
    </header>
  );
}
