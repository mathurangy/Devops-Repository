import React from "react";

export default function Navbar({ isLoggedIn, onLogout }) {
  return (
    <nav style={styles.navbar}>
      <div style={styles.brandWrap}>
        <div style={styles.logoDot}></div>
        <h1 style={styles.title}>Daycare Waitlist</h1>
      </div>

      {isLoggedIn && (
        <button style={styles.logoutButton} onClick={onLogout}>
          Logout
        </button>
      )}
    </nav>
  );
}

const styles = {
  navbar: {
    position: "sticky",
    top: 0,
    zIndex: 100,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 24px",
    background: "rgba(2, 6, 23, 0.88)",
    backdropFilter: "blur(14px)",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    boxShadow: "0 10px 24px rgba(0,0,0,0.18)",
  },
  brandWrap: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  logoDot: {
    width: "12px",
    height: "12px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #60a5fa, #8b5cf6)",
    boxShadow: "0 0 12px rgba(96,165,250,0.6)",
  },
  title: {
    margin: 0,
    fontSize: "24px",
    fontWeight: "800",
    color: "#ffffff",
    letterSpacing: "0.01em",
  },
  logoutButton: {
    padding: "10px 16px",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.12)",
    background: "linear-gradient(135deg, #fb7185, #ef4444)",
    color: "#ffffff",
    fontWeight: "800",
    fontSize: "14px",
    cursor: "pointer",
    boxShadow: "0 10px 20px rgba(239,68,68,0.24)",
  },
};