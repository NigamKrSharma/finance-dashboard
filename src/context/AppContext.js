import React, { createContext, useContext, useState, useEffect } from "react";
import { INITIAL_TRANSACTIONS } from "../data/transactions";

const AppContext = createContext(null);

export function useAppContext() {
  return useContext(AppContext);
}

export function AppProvider({ children }) {
  const [transactions, setTransactions] = useState(() => {
    try {
      const saved = localStorage.getItem("fd_transactions");
      return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
    } catch {
      return INITIAL_TRANSACTIONS;
    }
  });

  const [role, setRole] = useState(() => {
    return localStorage.getItem("fd_role") || "viewer";
  });

  const [activeTab, setActiveTab] = useState("dashboard");

  const [filters, setFilters] = useState({
    search: "",
    type: "all",
    category: "all",
  });

  const [sort, setSort] = useState({ field: "date", dir: "desc" });

  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("fd_transactions", JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem("fd_role", role);
  }, [role]);

  function addTransaction(tx) {
    setTransactions((prev) => [tx, ...prev]);
  }

  function updateTransaction(updated) {
    setTransactions((prev) =>
      prev.map((tx) => (tx.id === updated.id ? updated : tx)),
    );
  }

  function deleteTransaction(id) {
    setTransactions((prev) => prev.filter((tx) => tx.id !== id));
  }

  function resetData() {
    setTransactions(INITIAL_TRANSACTIONS);
  }

  function updateFilter(key, value) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  function updateSort(field) {
    setSort((prev) => ({
      field,
      dir: prev.field === field && prev.dir === "asc" ? "desc" : "asc",
    }));
  }

  const value = {
    transactions,
    role,
    setRole,
    activeTab,
    setActiveTab,
    filters,
    updateFilter,
    sort,
    updateSort,
    sidebarOpen,
    setSidebarOpen,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    resetData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
