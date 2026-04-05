import React from "react";
import { AppProvider, useAppContext } from "./context/AppContext";
import Sidebar from "./components/Sidebar/Sidebar";
import TopBar from "./components/TopBar/TopBar";
import DashboardPage from "./components/Dashboard/DashboardPage";
import TransactionsPage from "./components/Transactions/TransactionsPage";
import InsightsPage from "./components/Insights/InsightsPage";
import styles from "./App.module.css";

function AppInner() {
  const { activeTab } = useAppContext();

  function renderPage() {
    switch (activeTab) {
      case "dashboard":
        return <DashboardPage />;
      case "transactions":
        return <TransactionsPage />;
      case "insights":
        return <InsightsPage />;
      default:
        return <DashboardPage />;
    }
  }

  return (
    <div className={styles.app}>
      <Sidebar />

      <div className={styles.mainWrapper}>
        <TopBar />

        <main className={styles.content}>{renderPage()}</main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  );
}
