import { useEffect } from "react";

function SupportDialog({ onClose, onNavigate }) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const navigate = (page) => {
    onClose();
    onNavigate(page);
  };

  return (
    <div
      className="dialog-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="support-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="support-title"
      >
        <button
          className="dialog-close"
          type="button"
          onClick={onClose}
          aria-label="Close help center"
        >
          ×
        </button>
        <span className="support-dialog-icon" aria-hidden="true">?</span>
        <span className="panel-eyebrow">IMPACTFLOW SUPPORT</span>
        <h2 id="support-title">How can we help?</h2>
        <p className="support-intro">
          Find a quick guide or get in touch with your workspace administrator.
        </p>

        <div className="support-quick-links">
          <button type="button" onClick={() => navigate("Beneficiaries")}>
            <span className="support-link-icon" aria-hidden="true">♙</span>
            <span><strong>Beneficiary records</strong><small>View and update a beneficiary record</small></span>
            <span aria-hidden="true">→</span>
          </button>
          <button type="button" onClick={() => navigate("Documents")}>
            <span className="support-link-icon" aria-hidden="true">▧</span>
            <span><strong>Document uploads</strong><small>Learn where to add supporting files</small></span>
            <span aria-hidden="true">→</span>
          </button>
          <button type="button" onClick={() => navigate("Settings")}>
            <span className="support-link-icon" aria-hidden="true">⚙</span>
            <span><strong>Workspace settings</strong><small>Manage preferences and organisation details</small></span>
            <span aria-hidden="true">→</span>
          </button>
        </div>

        <details className="support-faq">
          <summary>Where is my workspace data stored?</summary>
          <p>
            Beneficiary records and uploaded documents are sent to the connected
            API. Appearance and some workspace preferences are saved in this
            browser. Confirm your organisation’s backup and access policies with
            your workspace administrator.
          </p>
        </details>

        <div className="support-contact">
          <strong>Need more help?</strong>
          <p>Contact the administrator who manages your ImpactFlow workspace.</p>
        </div>
      </section>
    </div>
  );
}

export default SupportDialog;
