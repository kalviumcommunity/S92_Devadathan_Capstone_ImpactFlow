import { useState } from "react";

function Header({
  activePage,
  user,
  theme,
  onThemeChange,
  onLogout,
  onHelp,
  onOpenProfile,
}) {
  const [themeError, setThemeError] = useState("");
  const displayName = user?.name || user?.username || "Workspace member";
  const initial = displayName.charAt(0).toUpperCase();
  const isDark = theme === "dark";

  const toggleTheme = () => {
    const saved = onThemeChange(isDark ? "light" : "dark");
    setThemeError(saved ? "" : "Theme preference could not be saved in this browser.");
  };

  return (
    <header className="app-header">
      <div className="header-breadcrumb">
        <span>Workspace</span>
        <span className="breadcrumb-divider" aria-hidden="true">/</span>
        <strong>{activePage}</strong>
      </div>

      <div className="header-actions">
        <button
          className="theme-switch header-theme-switch"
          type="button"
          role="switch"
          aria-label="Dark mode"
          aria-checked={isDark}
          title={isDark ? "Switch to light mode" : "Switch to dark mode"}
          onClick={toggleTheme}
        >
          <span className="theme-switch-thumb" aria-hidden="true" />
          <span className="theme-switch-icon theme-switch-sun" aria-hidden="true">☀</span>
          <span className="theme-switch-icon theme-switch-moon" aria-hidden="true">☾</span>
        </button>
        {themeError && <span className="theme-switch-error" role="status">{themeError}</span>}
        <button className="header-help-button" type="button" onClick={onHelp}>
          <span aria-hidden="true">?</span> Help
        </button>
        <button
          className="header-profile"
          type="button"
          onClick={onOpenProfile}
          aria-label={`Open ${displayName}'s profile`}
        >
          <span className="header-avatar" aria-hidden="true">{initial}</span>
          <div className="header-profile-details">
            <strong>{displayName}</strong>
            <span>{user?.email || "ImpactFlow member"}</span>
          </div>
          <span className="profile-open-icon" aria-hidden="true">↗</span>
        </button>
        <button className="sign-out-button" type="button" onClick={onLogout}>
          Sign out
        </button>
      </div>
    </header>
  );
}

export default Header;
