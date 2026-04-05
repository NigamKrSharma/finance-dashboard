
import React from "react";
import { useAppContext } from "../../context/AppContext";
import styles from "./Sidebar.module.css";

const NAV_ITEMS = [
  { id: "dashboard",    label: "Dashboard",    icon: "⬡" },
  { id: "transactions", label: "Transactions", icon: "⇄" },
  { id: "insights",     label: "Insights",     icon: "◈" },
];

export default function Sidebar() {
  const { activeTab, setActiveTab, role, setRole, sidebarOpen, setSidebarOpen } = useAppContext();

  function handleNavClick(tabId) {
    setActiveTab(tabId);
    setSidebarOpen(false); 
  }

  return (
    <>
  
      {sidebarOpen && (
        <div
          className={styles.overlay}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.open : ""}`}>
      
        <div className={styles.logo}>
          <div className={styles.logoIcon}>◈</div>
          <div>
            <div className={styles.logoText}>F-Dashboard</div>
            <div className={styles.logoSub}>Personal Finance</div>
          </div>
        </div>

        <nav className={styles.nav}>
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              className={`${styles.navItem} ${activeTab === item.id ? styles.active : ""}`}
              onClick={() => handleNavClick(item.id)}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              <span className={styles.navLabel}>{item.label}</span>
              {activeTab === item.id && <span className={styles.activeDot} />}
            </button>
          ))}
        </nav>

      
        <div className={styles.divider} />

        <div className={styles.roleSection}>
          <p className={styles.roleLabel}>Current Role</p>
          <select
            className={styles.roleSelect}
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="viewer">Viewer</option>
            <option value="admin">Admin</option>
          </select>

          
          <div className={`${styles.roleBadge} ${styles[role]}`}>
            <span className={styles.badgeDot} />
            {role === "admin" ? "Can edit & add data" : "Read only access"}
          </div>
        </div>

        
        <div className={styles.version}>v1.0.0 · 2024</div>
      </aside>
    </>
  );
}
