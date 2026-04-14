import { gql } from "@apollo/client";
import { useQuery, useMutation } from "@apollo/client/react";
import { useEffect, useMemo, useState } from "react";
// Dashboard feature added
const CURRENT_USER = gql`
  query {
    currentUser {
      username
      email
      role
    }
  }
`;

const MY_REQUESTS = gql`
  query {
    myRequests {
      id
      parentName
      childName
      childAge
      startDate
      location
    }
  }
`;

const ADD_REQUEST = gql`
  mutation AddRequest(
    $parentName: String!
    $childName: String!
    $childAge: Int!
    $startDate: String!
    $location: String!
  ) {
    addRequest(
      parentName: $parentName
      childName: $childName
      childAge: $childAge
      startDate: $startDate
      location: $location
    ) {
      id
      parentName
      childName
      childAge
      startDate
      location
    }
  }
`;

const UPDATE_REQUEST = gql`
  mutation UpdateRequest(
    $id: ID!
    $parentName: String!
    $childName: String!
    $childAge: Int!
    $startDate: String!
    $location: String!
  ) {
    updateRequest(
      id: $id
      parentName: $parentName
      childName: $childName
      childAge: $childAge
      startDate: $startDate
      location: $location
    ) {
      id
      parentName
      childName
      childAge
      startDate
      location
    }
  }
`;

const DELETE_REQUEST = gql`
  mutation DeleteRequest($id: ID!) {
    deleteRequest(id: $id)
  }
`;

export default function Dashboard({ setPage }) {
  const { loading, error, refetch } = useQuery(CURRENT_USER);
  const {
    data: requestsData,
    loading: requestsLoading,
    refetch: refetchRequests,
  } = useQuery(MY_REQUESTS);

  const [addRequest] = useMutation(ADD_REQUEST);
  const [updateRequest] = useMutation(UPDATE_REQUEST);
  const [deleteRequest] = useMutation(DELETE_REQUEST);

  const [username, setUsername] = useState(localStorage.getItem("username") || "");
  const [email, setEmail] = useState(localStorage.getItem("email") || "");
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    parentName: "",
    childName: "",
    childAge: "",
    startDate: "",
    location: "",
  });

  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = await refetch();

        if (result.data?.currentUser) {
          setUsername(result.data.currentUser.username);
          setEmail(result.data.currentUser.email);

          localStorage.setItem("username", result.data.currentUser.username);
          localStorage.setItem("email", result.data.currentUser.email);
        }
      } catch (err) {
        localStorage.clear();
        setPage("login");
      }
    };

    fetchUser();
  }, [refetch, setPage]);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      setPage("login");
    }
  }, [setPage]);

  const requests = requestsData?.myRequests || [];

const stats = useMemo(() => {
  return {
    total: requests.length,
    locations: new Set(requests.map((r) => r.location)).size,
    youngest:
      requests.length > 0
        ? Math.min(...requests.map((r) => Number(r.childAge)))
        : 0,
  };
}, [requests]);

if (loading && !username) return <p style={styles.loading}>Loading...</p>;

if (error) {
  localStorage.clear();
  setPage("login");
  return null;
}

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setFormData({
      parentName: "",
      childName: "",
      childAge: "",
      startDate: "",
      location: "",
    });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await updateRequest({
          variables: {
            id: editingId,
            parentName: formData.parentName,
            childName: formData.childName,
            childAge: parseInt(formData.childAge),
            startDate: formData.startDate,
            location: formData.location,
          },
        });
        setMessage("Request updated successfully.");
      } else {
        await addRequest({
          variables: {
            parentName: formData.parentName,
            childName: formData.childName,
            childAge: parseInt(formData.childAge),
            startDate: formData.startDate,
            location: formData.location,
          },
        });
        setMessage("Request submitted successfully.");
      }

      resetForm();
      refetchRequests();
    } catch (err) {
      console.error(err);
      setMessage("Error saving request.");
    }
  };

  const handleEdit = (request) => {
    setEditingId(request.id);
    setFormData({
      parentName: request.parentName,
      childName: request.childName,
      childAge: request.childAge,
      startDate: request.startDate,
      location: request.location,
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this request?"
    );

    if (!confirmDelete) return;

    try {
      await deleteRequest({
        variables: { id },
      });
      setMessage("Request deleted successfully.");
      refetchRequests();
    } catch (err) {
      console.error(err);
      setMessage("Error deleting request.");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.overlay}>
        <div style={styles.hero}>
          <div style={styles.heroLeft}>
            <div style={styles.heroPill}>Parent Dashboard</div>
            <h1 style={styles.heroTitle}>Manage your daycare requests</h1>
            <p style={styles.heroText}>
              A modern portal for submitting, updating, and reviewing daycare
              waitlist requests.
            </p>
          </div>

          <div style={styles.profileCard}>
            <p style={styles.profileLabel}>Account</p>
            <h3 style={styles.profileName}>{username}</h3>
            <p style={styles.profileEmail}>{email}</p>
          </div>
        </div>

        <div style={styles.statsRow}>
          <div style={styles.statCard}>
            <p style={styles.statLabel}>Total Requests</p>
            <h2 style={styles.statValue}>{stats.total}</h2>
          </div>
          <div style={styles.statCard}>
            <p style={styles.statLabel}>Locations Chosen</p>
            <h2 style={styles.statValue}>{stats.locations}</h2>
          </div>
          <div style={styles.statCard}>
            <p style={styles.statLabel}>Youngest Age</p>
            <h2 style={styles.statValue}>{stats.youngest || "-"}</h2>
          </div>
        </div>

        {message && <div style={styles.messageBox}>{message}</div>}

        <div style={styles.grid}>
          <div style={styles.formCard}>
            <div style={styles.cardHeader}>
              <h2 style={styles.cardTitle}>
                {editingId ? "Update Request" : "New Waitlist Request"}
              </h2>
              <p style={styles.cardSubtitle}>
                Fill out the form below to add your daycare waitlist request.
              </p>
            </div>

            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Parent Name</label>
                <input
                  name="parentName"
                  placeholder="Enter parent name"
                  value={formData.parentName}
                  onChange={handleChange}
                  required
                  style={styles.input}
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Child Name</label>
                <input
                  name="childName"
                  placeholder="Enter child name"
                  value={formData.childName}
                  onChange={handleChange}
                  required
                  style={styles.input}
                />
              </div>

              <div style={styles.twoCol}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Child Age</label>
                  <input
                    type="number"
                    name="childAge"
                    placeholder="Age"
                    value={formData.childAge}
                    onChange={handleChange}
                    required
                    style={styles.input}
                  />
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Preferred Start Date</label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    required
                    style={styles.input}
                  />
                </div>
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Preferred Location</label>
                <input
                  name="location"
                  placeholder="Enter preferred location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  style={styles.input}
                />
              </div>

              <div style={styles.buttonRow}>
                <button type="submit" style={styles.primaryButton}>
                  {editingId ? "Update Request" : "Submit Request"}
                </button>

                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    style={styles.secondaryButton}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          <div style={styles.listCard}>
            <div style={styles.cardHeader}>
              <h2 style={styles.cardTitle}>My Waitlist Requests</h2>
              <p style={styles.cardSubtitle}>
                Review, edit, or remove any submitted request.
              </p>
            </div>

            {requestsLoading ? (
              <p style={styles.emptyText}>Loading requests...</p>
            ) : requests.length === 0 ? (
              <div style={styles.emptyState}>
                <p style={styles.emptyStateTitle}>No requests yet</p>
                <p style={styles.emptyStateText}>
                  Once you submit a request, it will appear here.
                </p>
              </div>
            ) : (
              <div style={styles.requestList}>
                {requests.map((request) => (
                  <div
                    key={request.id}
                    style={styles.requestCard}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-4px)";
                      e.currentTarget.style.boxShadow =
                        "0 20px 35px rgba(15, 23, 42, 0.16)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow =
                        "0 8px 18px rgba(15, 23, 42, 0.08)";
                    }}
                  >
                    <div style={styles.requestTop}>
                      <div>
                        <h3 style={styles.requestTitle}>{request.childName}</h3>
                        <p style={styles.requestParent}>
                          Parent: {request.parentName}
                        </p>
                      </div>
                      <span style={styles.locationBadge}>{request.location}</span>
                    </div>

                    <div style={styles.requestMetaRow}>
                      <div style={styles.metaCard}>
                        <span style={styles.metaLabel}>Age</span>
                        <span style={styles.metaValue}>{request.childAge}</span>
                      </div>
                      <div style={styles.metaCard}>
                        <span style={styles.metaLabel}>Start Date</span>
                        <span style={styles.metaValue}>{request.startDate}</span>
                      </div>
                    </div>

                    <div style={styles.actionRow}>
                      <button
                        style={styles.editButton}
                        onClick={() => handleEdit(request)}
                      >
                        Edit
                      </button>
                      <button
                        style={styles.deleteButton}
                        onClick={() => handleDelete(request.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at top left, #1e293b 0%, #0f172a 38%, #020617 100%)",
    padding: "32px 20px 60px",
  },
  overlay: {
    maxWidth: "1280px",
    margin: "0 auto",
  },
  hero: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "stretch",
    gap: "24px",
    flexWrap: "wrap",
    padding: "34px",
    borderRadius: "28px",
    background:
      "linear-gradient(135deg, rgba(59,130,246,0.22), rgba(168,85,247,0.18))",
    border: "1px solid rgba(255,255,255,0.12)",
    backdropFilter: "blur(18px)",
    boxShadow: "0 20px 50px rgba(0,0,0,0.28)",
    marginBottom: "24px",
  },
  heroLeft: {
    flex: "1 1 600px",
  },
  heroPill: {
    display: "inline-block",
    padding: "8px 16px",
    borderRadius: "999px",
    backgroundColor: "rgba(255,255,255,0.12)",
    color: "#c4b5fd",
    fontWeight: "700",
    fontSize: "13px",
    marginBottom: "14px",
    border: "1px solid rgba(255,255,255,0.1)",
  },
  heroTitle: {
    margin: "0 0 12px 0",
    fontSize: "42px",
    color: "#ffffff",
    lineHeight: "1.1",
  },
  heroText: {
    margin: 0,
    color: "#dbeafe",
    fontSize: "17px",
    lineHeight: "1.7",
    maxWidth: "760px",
  },
  profileCard: {
    minWidth: "280px",
    padding: "24px",
    borderRadius: "24px",
    background: "rgba(255,255,255,0.09)",
    border: "1px solid rgba(255,255,255,0.12)",
    color: "#ffffff",
    alignSelf: "center",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
  },
  profileLabel: {
    margin: "0 0 10px 0",
    color: "#cbd5e1",
    fontSize: "13px",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    fontWeight: "700",
  },
  profileName: {
    margin: "0 0 8px 0",
    fontSize: "28px",
    color: "#ffffff",
  },
  profileEmail: {
    margin: 0,
    color: "#dbeafe",
    fontSize: "15px",
  },
  statsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(180px, 1fr))",
    gap: "18px",
    marginBottom: "22px",
  },
  statCard: {
    padding: "22px",
    borderRadius: "22px",
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.1)",
    backdropFilter: "blur(16px)",
    boxShadow: "0 10px 24px rgba(0,0,0,0.18)",
  },
  statLabel: {
    margin: "0 0 8px 0",
    color: "#cbd5e1",
    fontSize: "14px",
    fontWeight: "600",
  },
  statValue: {
    margin: 0,
    color: "#ffffff",
    fontSize: "34px",
  },
  messageBox: {
    marginBottom: "22px",
    padding: "16px 18px",
    borderRadius: "18px",
    background: "rgba(16,185,129,0.16)",
    border: "1px solid rgba(52,211,153,0.3)",
    color: "#d1fae5",
    fontWeight: "700",
    boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "minmax(340px, 430px) 1fr",
    gap: "24px",
    alignItems: "start",
  },
  formCard: {
    padding: "28px",
    borderRadius: "26px",
    background: "rgba(255,255,255,0.09)",
    border: "1px solid rgba(255,255,255,0.12)",
    backdropFilter: "blur(16px)",
    boxShadow: "0 18px 34px rgba(0,0,0,0.22)",
  },
  listCard: {
    padding: "28px",
    borderRadius: "26px",
    background: "rgba(255,255,255,0.09)",
    border: "1px solid rgba(255,255,255,0.12)",
    backdropFilter: "blur(16px)",
    boxShadow: "0 18px 34px rgba(0,0,0,0.22)",
  },
  cardHeader: {
    marginBottom: "20px",
  },
  cardTitle: {
    margin: "0 0 8px 0",
    color: "#ffffff",
    fontSize: "30px",
  },
  cardSubtitle: {
    margin: 0,
    color: "#cbd5e1",
    fontSize: "15px",
    lineHeight: "1.6",
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
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
  },
  twoCol: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "14px",
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
  requestList: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },
  requestCard: {
    padding: "20px",
    borderRadius: "22px",
    background: "rgba(255,255,255,0.1)",
    border: "1px solid rgba(255,255,255,0.12)",
    boxShadow: "0 8px 18px rgba(15, 23, 42, 0.08)",
    transition: "all 0.18s ease",
  },
  requestTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "14px",
    marginBottom: "16px",
  },
  requestTitle: {
    margin: "0 0 6px 0",
    fontSize: "24px",
    color: "#ffffff",
  },
  requestParent: {
    margin: 0,
    color: "#cbd5e1",
    fontSize: "14px",
  },
  locationBadge: {
    background: "linear-gradient(135deg, #c4b5fd, #818cf8)",
    color: "#1e1b4b",
    padding: "8px 14px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "800",
    whiteSpace: "nowrap",
  },
  requestMetaRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
    marginBottom: "16px",
  },
  metaCard: {
    padding: "12px 14px",
    borderRadius: "16px",
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.08)",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  metaLabel: {
    color: "#cbd5e1",
    fontSize: "12px",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
  },
  metaValue: {
    color: "#ffffff",
    fontSize: "15px",
    fontWeight: "700",
  },
  actionRow: {
    display: "flex",
    gap: "12px",
  },
  editButton: {
    padding: "11px 16px",
    borderRadius: "12px",
    border: "none",
    background: "linear-gradient(135deg, #fbbf24, #f59e0b)",
    color: "#1f2937",
    fontWeight: "800",
    cursor: "pointer",
  },
  deleteButton: {
    padding: "11px 16px",
    borderRadius: "12px",
    border: "none",
    background: "linear-gradient(135deg, #fb7185, #ef4444)",
    color: "#ffffff",
    fontWeight: "800",
    cursor: "pointer",
  },
  emptyText: {
    color: "#cbd5e1",
    fontSize: "15px",
  },
  emptyState: {
    padding: "28px",
    borderRadius: "20px",
    background: "rgba(255,255,255,0.08)",
    border: "1px dashed rgba(255,255,255,0.14)",
    textAlign: "center",
  },
  emptyStateTitle: {
    margin: "0 0 8px 0",
    color: "#ffffff",
    fontSize: "20px",
    fontWeight: "700",
  },
  emptyStateText: {
    margin: 0,
    color: "#cbd5e1",
    fontSize: "14px",
  },
  loading: {
    padding: "24px",
    textAlign: "center",
    color: "#ffffff",
  },
};