function Sidebar({
  activePage = "Dashboard",
  setActivePage = () => {},
  user,
  onHelp,
  onToggleSidebar,
  collapsed = false,
}) {
  const displayName = user?.name || user?.username || "Workspace member";
  const menuItems = [
    { name: "Dashboard", icon: "▦" },
    { name: "Beneficiaries", icon: "♙" },
    { name: "Programs", icon: "◈" },
    { name: "Reports", icon: "▤" },
    { name: "Documents", icon: "▧" },
    { name: "Settings", icon: "⚙" },
  ];

  return (
    <aside className={`app-sidebar ${collapsed ? "is-collapsed" : ""}`}>
      <div className="sidebar-brand">
        <img
          className="sidebar-logo sidebar-logo-full"
          src="/impactflow-logo.svg"
          alt="ImpactFlow — community impact, in focus"
        />
        <img
          className="sidebar-logo sidebar-logo-mark"
          src="/impactflow-mark.svg"
          alt="ImpactFlow"
          aria-hidden="true"
        />
      </div>

      <button
        className="sidebar-toggle-button sidebar-collapse-toggle"
        type="button"
        aria-label={collapsed ? "Show sidebar" : "Hide sidebar"}
        aria-expanded={!collapsed}
        aria-controls="workspace-sidebar-navigation"
        title={collapsed ? "Show sidebar" : "Hide sidebar"}
        onClick={onToggleSidebar}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <div className="sidebar-section-label">WORKSPACE</div>

      <nav
        className="sidebar-nav"
        id="workspace-sidebar-navigation"
        aria-label="Main navigation"
      >
        {menuItems.map((item) => (
          <button
            key={item.name}
            type="button"
            className={`sidebar-link ${
              activePage === item.name ? "active" : ""
            }`}
            onClick={() => setActivePage(item.name)}
            aria-label={item.name}
            title={collapsed ? item.name : undefined}
            aria-current={activePage === item.name ? "page" : undefined}
          >
            <span className="sidebar-link-icon" aria-hidden="true">
              {item.icon}
            </span>
            <span className="sidebar-link-label">{item.name}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <button
          className="sidebar-help-card"
          type="button"
          onClick={onHelp}
          aria-label="Need help?"
          title={collapsed ? "Need help?" : undefined}
        >
          <div className="help-icon">?</div>
          <div>
            <strong>Need help?</strong>
            <p>We're here to help you.</p>
          </div>
          <span className="help-open-icon" aria-hidden="true">↗</span>
        </button>

        <button
          className={`sidebar-profile ${activePage === "Profile" ? "profile-active" : ""}`}
          type="button"
          onClick={() => setActivePage("Profile")}
          aria-label={`Open ${displayName}'s profile`}
          title={collapsed ? `${displayName}'s profile` : undefined}
          aria-current={activePage === "Profile" ? "page" : undefined}
        >
          <div className="profile-avatar" aria-hidden="true">
            {displayName.charAt(0).toUpperCase()}
          </div>
          <div className="profile-details">
            <strong>{displayName}</strong>
            <span>{user?.email || "Workspace member"}</span>
          </div>
          <span className="profile-open-icon" aria-hidden="true">↗</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;