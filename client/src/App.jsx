import { useEffect, useState } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import BeneficiaryCard from "./components/BeneficiaryCard";
import Footer from "./components/Footer";
import FileUpload from "./components/FileUpload";
import LoginPage from "./components/LoginPage";
import ProfilePage from "./components/ProfilePage";
import SupportDialog from "./components/SupportDialog";
import {
  ProgramsPage,
  ReportsPage,
  SettingsPage,
} from "./components/WorkspacePages";
import "./App.css";

const themeStorageKey = "impactflow-theme";

function readThemePreference() {
  try {
    return localStorage.getItem(themeStorageKey) === "dark" ? "dark" : "light";
  } catch {
    return "light";
  }
}

function readInitialAuthState() {
  const callback = new URLSearchParams(window.location.hash.slice(1));
  const token = callback.get("token");
  const authError = callback.get("auth_error");

  if (token) {
    const session = {
      token,
      expiresAt: Date.now() + 60 * 60 * 1000,
      user: {
        name: callback.get("name") || "ImpactFlow user",
        email: callback.get("email") || "",
      },
    };
    return { session, error: "" };
  }

  if (authError) {
    return {
      session: null,
      error: "Google sign-in didn't complete. Please try again.",
    };
  }

  try {
    const storedSession = JSON.parse(
      sessionStorage.getItem("impactflow-session")
    );
    if (storedSession?.token && storedSession.expiresAt > Date.now()) {
      return { session: storedSession, error: "" };
    }

    return { session: null, error: "" };
  } catch {
    return { session: null, error: "" };
  }
}

function App() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [initialAuthState] = useState(readInitialAuthState);
  const [authState, setAuthState] = useState(initialAuthState);
  const [theme, setTheme] = useState(readThemePreference);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
  }, [theme]);

  useEffect(() => {
    if (window.location.hash) {
      window.history.replaceState(
        null,
        "",
        `${window.location.pathname}${window.location.search}`
      );
    }

    if (initialAuthState.session) {
      sessionStorage.setItem(
        "impactflow-session",
        JSON.stringify(initialAuthState.session)
      );
    } else {
      sessionStorage.removeItem("impactflow-session");
    }
  }, [initialAuthState]);

  const handleLogin = (session) => {
    const sessionWithExpiry = {
      ...session,
      expiresAt: Date.now() + 60 * 60 * 1000,
    };
    sessionStorage.setItem(
      "impactflow-session",
      JSON.stringify(sessionWithExpiry)
    );
    setAuthState({ session: sessionWithExpiry, error: "" });
  };

  const handleLogout = () => {
    sessionStorage.removeItem("impactflow-session");
    setAuthState({ session: null, error: "" });
    setActivePage("Dashboard");
  };

  const handleThemeChange = (nextTheme) => {
    if (!["light", "dark"].includes(nextTheme)) return false;
    try {
      localStorage.setItem(themeStorageKey, nextTheme);
      setTheme(nextTheme);
      return true;
    } catch {
      return false;
    }
  };

  const handleProfileSave = (user) => {
    const session = {
      ...authState.session,
      user,
    };
    sessionStorage.setItem("impactflow-session", JSON.stringify(session));
    setAuthState((current) => ({ ...current, session }));
  };

  if (!authState.session?.token) {
    return (
      <LoginPage onLogin={handleLogin} authError={authState.error} />
    );
  }

  return (
    <div className={`app-layout ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        user={authState.session.user}
        onHelp={() => setHelpOpen(true)}
        onToggleSidebar={() => setSidebarCollapsed((collapsed) => !collapsed)}
        collapsed={sidebarCollapsed}
      />

      <div className="main-layout">
        <Header
          activePage={activePage}
          user={authState.session.user}
          theme={theme}
          onThemeChange={handleThemeChange}
          onLogout={handleLogout}
          onHelp={() => setHelpOpen(true)}
          onOpenProfile={() => setActivePage("Profile")}
        />

        <main className="dashboard-content">
          {activePage === "Dashboard" && (
            <>
              <section className="page-heading">
                <div>
                  <span className="page-eyebrow">
                    WORKSPACE OVERVIEW
                  </span>
                  <h1>Welcome back, {authState.session.user?.name || "there"}.</h1>
                  <p>
                    Here’s what’s happening across your programs today.
                  </p>
                </div>

                <button
                  className="primary-button"
                  onClick={() => setActivePage("Beneficiaries")}
                >
                  View beneficiary records
                </button>
              </section>

              <div className="sample-data-note">
                <span aria-hidden="true">i</span>
                Illustrative dashboard figures — connect live organisation records before using these numbers for decisions or reporting.
              </div>

              <section className="stats-grid">
                <article className="stat-card">
                  <span className="stat-label">
                    Total beneficiaries
                  </span>
                  <h2>1,247</h2>
                  <span className="stat-positive">
                    ↗ 12.8% this month
                  </span>
                </article>

                <article className="stat-card">
                  <span className="stat-label">
                    Active programs
                  </span>
                  <h2>08</h2>
                  <span className="stat-positive">
                    ↗ 2 new programs
                  </span>
                </article>

                <article className="stat-card">
                  <span className="stat-label">
                    Funds distributed
                  </span>
                  <h2>₹8.42L</h2>
                  <span className="stat-positive">
                    ↗ 8.2% this month
                  </span>
                </article>

                <article className="stat-card">
                  <span className="stat-label">
                    Pending reviews
                  </span>
                  <h2>12</h2>
                  <span className="stat-warning">
                    Requires attention
                  </span>
                </article>
              </section>

              <section className="content-panel">
                <div className="section-heading">
                  <div>
                    <h2>Beneficiary overview</h2>
                    <p>
                      Manage your beneficiaries and their program records.
                    </p>
                  </div>
                </div>

                <BeneficiaryCard token={authState.session.token} />
              </section>

              <section className="content-panel">
                <div className="section-heading">
                  <div>
                    <h2>Documents</h2>
                    <p>
                      Upload supporting files for authorised programme and beneficiary records.
                    </p>
                  </div>
                </div>

                <FileUpload token={authState.session.token} />
              </section>
            </>
          )}

          {activePage === "Beneficiaries" && (
            <>
              <section className="page-heading workspace-page-heading">
                <div>
                  <span className="page-eyebrow">PEOPLE & COMMUNITIES</span>
                  <h1>Beneficiaries</h1>
                  <p>
                    Keep individual records clear, consistent, and ready for your programme team.
                  </p>
                </div>
                <button
                  className="primary-button"
                  onClick={() =>
                    document
                      .querySelector(".beneficiary-card")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  View beneficiary record
                </button>
              </section>

              <div className="beneficiary-data-note">
                <span aria-hidden="true">i</span>
                This view currently shows a sample beneficiary record. Connect your organisation’s live beneficiary registry before using sample details for programme decisions.
              </div>

              <section className="beneficiary-summary-grid" aria-label="Beneficiary record summary">
                <article>
                  <span className="beneficiary-summary-icon" aria-hidden="true">♙</span>
                  <span><small>Record in view</small><strong>1 sample record</strong></span>
                </article>
                <article>
                  <span className="beneficiary-summary-icon summary-status-icon" aria-hidden="true">✓</span>
                  <span><small>Record status</small><strong>Active</strong></span>
                </article>
                <article>
                  <span className="beneficiary-summary-icon summary-privacy-icon" aria-hidden="true">⌑</span>
                  <span><small>Data handling</small><strong>Handle confidentially</strong></span>
                </article>
              </section>

              <section className="content-panel beneficiary-page">
                <BeneficiaryCard token={authState.session.token} />
              </section>

              <section className="page-heading workspace-page-heading document-page-heading">
                <div>
                  <span className="page-eyebrow">SUPPORTING RECORDS</span>
                  <h2>Beneficiary documents</h2>
                  <p>Attach relevant files to support authorised case management.</p>
                </div>
              </section>

              <section className="content-panel">
                <FileUpload token={authState.session.token} />
              </section>
            </>
          )}

          {activePage === "Programs" && (
            <ProgramsPage token={authState.session.token} />
          )}

          {activePage === "Reports" && (
            <ReportsPage />
          )}

          {activePage === "Documents" && (
            <>
              <section className="page-heading workspace-page-heading document-page-heading">
                <div>
                  <span className="page-eyebrow">SUPPORTING DOCUMENTS</span>
                  <h1>Documents</h1>
                  <p>Upload supporting files for authorised programme and beneficiary records.</p>
                </div>
              </section>
              <div className="document-guidance-note">
                <strong>Before uploading</strong>
                <span>Only upload information your organisation is authorised to store. Follow your NGO’s consent, access, and retention policies. The workspace currently supports uploading files but does not show document history or retention status.</span>
              </div>
              <section className="content-panel">
                <FileUpload token={authState.session.token} />
              </section>
            </>
          )}

          {activePage === "Settings" && (
            <SettingsPage user={authState.session.user} />
          )}

          {activePage === "Profile" && (
            <ProfilePage
              user={authState.session.user}
              onSave={handleProfileSave}
            />
          )}

          <Footer />
        </main>
      </div>
      {helpOpen && (
        <SupportDialog
          onClose={() => setHelpOpen(false)}
          onNavigate={setActivePage}
        />
      )}
    </div>
  );
}

export default App;