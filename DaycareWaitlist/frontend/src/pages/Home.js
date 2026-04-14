export default function Home({ setPage }) {
  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.badge}>Daycare Waitlist Portal</div>
        <h1 style={styles.title}>Welcome to Daycare Waitlist System</h1>
        <p style={styles.subtitle}>
          A simple and secure portal where parents can register, sign in, and
          manage daycare waitlist requests.
        </p>

        <div style={styles.buttonRow}>
          <button style={styles.primaryButton} onClick={() => setPage("login")}>
            Login
          </button>
          <button style={styles.secondaryButton} onClick={() => setPage("register")}>
            Register
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "calc(100vh - 60px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "30px 20px",
    background:
      "radial-gradient(circle at top left, #1e293b 0%, #0f172a 38%, #020617 100%)",
  },
  card: {
    width: "100%",
    maxWidth: "720px",
    padding: "42px",
    borderRadius: "28px",
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.12)",
    backdropFilter: "blur(18px)",
    boxShadow: "0 22px 50px rgba(0,0,0,0.28)",
    textAlign: "center",
  },
  badge: {
    display: "inline-block",
    marginBottom: "16px",
    padding: "8px 16px",
    borderRadius: "999px",
    backgroundColor: "rgba(255,255,255,0.12)",
    color: "#c4b5fd",
    fontWeight: "700",
    fontSize: "13px",
    border: "1px solid rgba(255,255,255,0.1)",
  },
  title: {
    margin: "0 0 14px 0",
    fontSize: "42px",
    color: "#ffffff",
    lineHeight: "1.15",
  },
  subtitle: {
    margin: "0 auto 26px",
    maxWidth: "560px",
    fontSize: "17px",
    lineHeight: "1.7",
    color: "#dbeafe",
  },
  buttonRow: {
    display: "flex",
    justifyContent: "center",
    gap: "14px",
    flexWrap: "wrap",
  },
  primaryButton: {
    padding: "14px 22px",
    borderRadius: "14px",
    border: "none",
    background: "linear-gradient(135deg, #60a5fa, #8b5cf6)",
    color: "#ffffff",
    fontWeight: "800",
    fontSize: "15px",
    cursor: "pointer",
    boxShadow: "0 14px 26px rgba(96,165,250,0.28)",
  },
  secondaryButton: {
    padding: "14px 22px",
    borderRadius: "14px",
    border: "1px solid rgba(255,255,255,0.16)",
    background: "rgba(255,255,255,0.08)",
    color: "#ffffff",
    fontWeight: "700",
    fontSize: "15px",
    cursor: "pointer",
  },
};