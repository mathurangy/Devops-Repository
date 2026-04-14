import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { useState } from "react";

const LOGIN = gql`
  mutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        username
        email
      }
    }
  }
`;
//Login validation
export default function Login({ setPage }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [login] = useMutation(LOGIN);

  const handleSubmit = async () => {
    try {
      setErrorMessage("");

      const res = await login({ variables: { email, password } });

      localStorage.setItem("token", res.data.login.token);
      localStorage.setItem("username", res.data.login.user.username);
      localStorage.setItem("email", res.data.login.user.email);

      setPage("dashboard");
    } catch (err) {
      console.error(err);
      setErrorMessage("Invalid email or password.");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.badge}>Secure Access</div>
        <h1 style={styles.title}>Login</h1>
        <p style={styles.subtitle}>
          Sign in to access your daycare waitlist dashboard.
        </p>

        {errorMessage && <div style={styles.errorBox}>{errorMessage}</div>}

        <div style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input
              style={styles.input}
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              style={styles.input}
              placeholder="Enter your password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div style={styles.buttonRow}>
            <button style={styles.primaryButton} onClick={handleSubmit}>
              Login
            </button>
            <button style={styles.secondaryButton} onClick={() => setPage("home")}>
              Back
            </button>
          </div>
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
    maxWidth: "520px",
    padding: "38px",
    borderRadius: "28px",
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.12)",
    backdropFilter: "blur(18px)",
    boxShadow: "0 22px 50px rgba(0,0,0,0.28)",
  },
  badge: {
    display: "inline-block",
    marginBottom: "14px",
    padding: "8px 16px",
    borderRadius: "999px",
    backgroundColor: "rgba(255,255,255,0.12)",
    color: "#c4b5fd",
    fontWeight: "700",
    fontSize: "13px",
    border: "1px solid rgba(255,255,255,0.1)",
  },
  title: {
    margin: "0 0 10px 0",
    fontSize: "36px",
    color: "#ffffff",
  },
  subtitle: {
    margin: "0 0 24px 0",
    color: "#dbeafe",
    fontSize: "15px",
    lineHeight: "1.6",
  },
  errorBox: {
    marginBottom: "18px",
    padding: "12px 14px",
    borderRadius: "14px",
    background: "rgba(239,68,68,0.16)",
    border: "1px solid rgba(248,113,113,0.28)",
    color: "#fecaca",
    fontWeight: "600",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  label: {
    fontSize: "14px",
    fontWeight: "700",
    color: "#e2e8f0",
  },
  input: {
    padding: "14px 16px",
    borderRadius: "14px",
    border: "1px solid rgba(255,255,255,0.14)",
    fontSize: "14px",
    background: "rgba(255,255,255,0.08)",
    color: "#ffffff",
    outline: "none",
  },
  buttonRow: {
    display: "flex",
    gap: "12px",
    marginTop: "8px",
  },
  primaryButton: {
    padding: "13px 18px",
    borderRadius: "14px",
    border: "none",
    background: "linear-gradient(135deg, #60a5fa, #8b5cf6)",
    color: "#ffffff",
    fontWeight: "800",
    cursor: "pointer",
    boxShadow: "0 14px 26px rgba(96,165,250,0.28)",
  },
  secondaryButton: {
    padding: "13px 18px",
    borderRadius: "14px",
    border: "1px solid rgba(255,255,255,0.16)",
    background: "rgba(255,255,255,0.08)",
    color: "#ffffff",
    fontWeight: "700",
    cursor: "pointer",
  },
};