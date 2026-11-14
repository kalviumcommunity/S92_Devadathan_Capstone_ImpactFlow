import { useState } from "react";

function readProfile(user) {
  const defaults = {
    name: user?.name || user?.username || "",
    role: user?.role || "",
    phone: user?.phone || "",
  };

  try {
    const saved = localStorage.getItem(
      `impactflow-profile:${user?.email || user?.username || "account"}`
    );
    return saved ? { ...defaults, ...JSON.parse(saved) } : defaults;
  } catch {
    return defaults;
  }
}

function ProfilePage({ user, onSave }) {
  const [form, setForm] = useState(() => readProfile(user));
  const [saveMessage, setSaveMessage] = useState("");

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setSaveMessage("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const updatedUser = {
      ...user,
      ...form,
    };

    try {
      const key = `impactflow-profile:${user?.email || user?.username || "account"}`;
      localStorage.setItem(key, JSON.stringify(form));
      onSave(updatedUser);
      setSaveMessage("Your profile has been saved on this device.");
    } catch {
      setSaveMessage("We couldn't save your profile. Check browser storage and try again.");
    }
  };

  const displayName = user?.name || user?.username || "Workspace member";

  return (
    <>
      <section className="page-heading workspace-page-heading">
        <div>
          <span className="page-eyebrow">YOUR ACCOUNT</span>
          <h1>My profile</h1>
          <p>Keep your personal details current for your organisation’s workspace.</p>
        </div>
      </section>

      <div className="profile-page-layout">
        <section className="profile-summary-card">
          <div className="profile-cover" />
          <div className="profile-summary-content">
            <div className="profile-large-avatar" aria-hidden="true">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <span className="panel-eyebrow">WORKSPACE MEMBER</span>
            <h2>{displayName}</h2>
            <p>{user?.email || "Email address not available"}</p>
            <span className="profile-member-status">
              <span /> Account active
            </span>
            <div className="profile-summary-divider" />
            <div className="profile-summary-detail">
              <span>Role</span>
              <strong>{user?.role || "Not specified"}</strong>
            </div>
            <div className="profile-summary-detail">
              <span>Contact phone</span>
              <strong>{user?.phone || "Not specified"}</strong>
            </div>
          </div>
        </section>

        <form className="workspace-panel profile-edit-panel" onSubmit={handleSubmit}>
          <div className="workspace-panel-heading">
            <div>
              <span className="panel-eyebrow">PERSONAL INFORMATION</span>
              <h2>Profile details</h2>
              <p>Your email is managed by your sign-in provider and cannot be changed here.</p>
            </div>
          </div>
          <div className="workspace-form-grid profile-fields">
            <label className="workspace-field">
              Full name
              <input
                autoComplete="name"
                required
                value={form.name}
                onChange={(event) => updateField("name", event.target.value)}
              />
            </label>
            <label className="workspace-field">
              Work email
              <input
                type="email"
                value={user?.email || ""}
                readOnly
                aria-describedby="profile-email-note"
              />
              <small id="profile-email-note">Managed by your account sign-in.</small>
            </label>
            <label className="workspace-field">
              Role in your organisation
              <input
                value={form.role}
                onChange={(event) => updateField("role", event.target.value)}
                placeholder="e.g. Programme coordinator"
              />
            </label>
            <label className="workspace-field">
              Contact phone
              <input
                type="tel"
                autoComplete="tel"
                value={form.phone}
                onChange={(event) => updateField("phone", event.target.value)}
                placeholder="+91"
              />
            </label>
          </div>
          <div className="profile-save-row">
            <p
              className={saveMessage.startsWith("Your profile") ? "save-success" : "workspace-save-error"}
              role={saveMessage ? "status" : undefined}
            >
              {saveMessage}
            </p>
            <button className="primary-button" type="submit">Save profile</button>
          </div>
          <p className="workspace-storage-note">
            Profile details are stored in this browser on this device. Shared profile syncing is not configured yet.
          </p>
        </form>
      </div>
    </>
  );
}

export default ProfilePage;
