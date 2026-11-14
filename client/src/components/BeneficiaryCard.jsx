import { useState } from "react";
import { API_URL } from "../config";

function BeneficiaryCard({ token }) {
  const [beneficiary, setBeneficiary] = useState({
    _id: "6ab0c4d5a40d2ca370d82524",
    name: "Rahul",
    age: 20,
    location: "Chennai",
    program: "Education Support",
  });

  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (!beneficiary) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${API_URL}/api/beneficiaries/${beneficiary._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: beneficiary.name,
            age: Number(beneficiary.age),
            location: beneficiary.location,
            program: beneficiary.program,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Unable to update beneficiary. Please try again.");
      }

      const updatedBeneficiary = await response.json();
      setBeneficiary(updatedBeneficiary);
      setEditing(false);
    } catch (err) {
      setError(err.message || "Something went wrong while saving.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!beneficiary) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete ${beneficiary.name}?`
    );

    if (!confirmed) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${API_URL}/api/beneficiaries/${beneficiary._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Unable to delete beneficiary. Please try again.");
      }

      setBeneficiary(null);
      setEditing(false);
    } catch (err) {
      setError(err.message || "Something went wrong while deleting.");
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field, value) => {
    setBeneficiary((current) => ({
      ...current,
      [field]: value,
    }));
  };

  return (
    <section className="beneficiary-card content-panel">
      <div className="panel-heading">
        <div>
          <span className="panel-eyebrow">
            BENEFICIARY MANAGEMENT
          </span>
          <h2>Beneficiary Details</h2>
          <p className="panel-description">
            View and manage beneficiary information.
          </p>
        </div>

        {beneficiary && (
          <span className="status-badge status-active">
            <span className="status-dot"></span>
            Active
          </span>
        )}
      </div>

      {error && (
        <div className="form-error" role="alert">
          {error}
        </div>
      )}

      {!beneficiary ? (
        <div className="empty-state">
          <div className="empty-state-icon">✓</div>
          <h3>Beneficiary deleted</h3>
          <p>This beneficiary is no longer displayed.</p>
        </div>
      ) : editing ? (
        <form
          className="beneficiary-form"
          onSubmit={(event) => {
            event.preventDefault();
            handleSave();
          }}
        >
          <div className="form-grid">
            <label className="form-field">
              <span>Full name</span>
              <input
                type="text"
                value={beneficiary.name}
                onChange={(event) =>
                  updateField("name", event.target.value)
                }
                required
              />
            </label>

            <label className="form-field">
              <span>Age</span>
              <input
                type="number"
                min="1"
                value={beneficiary.age}
                onChange={(event) =>
                  updateField("age", event.target.value)
                }
                required
              />
            </label>

            <label className="form-field">
              <span>Location</span>
              <input
                type="text"
                value={beneficiary.location}
                onChange={(event) =>
                  updateField("location", event.target.value)
                }
                required
              />
            </label>

            <label className="form-field">
              <span>Program</span>
              <input
                type="text"
                value={beneficiary.program}
                onChange={(event) =>
                  updateField("program", event.target.value)
                }
                required
              />
            </label>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={() => setEditing(false)}
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="primary-button"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      ) : (
        <>
          <div className="beneficiary-profile">
            <div className="beneficiary-avatar">
              {beneficiary.name.charAt(0).toUpperCase()}
            </div>

            <div className="beneficiary-identity">
              <h3>{beneficiary.name}</h3>
              <p>Beneficiary ID: {beneficiary._id}</p>
            </div>
          </div>

          <div className="beneficiary-details-grid">
            <div className="detail-item">
              <span className="detail-label">Age</span>
              <span className="detail-value">
                {beneficiary.age} years
              </span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Location</span>
              <span className="detail-value">
                {beneficiary.location}
              </span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Program</span>
              <span className="detail-value">
                {beneficiary.program}
              </span>
            </div>
          </div>

          <div className="beneficiary-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={() => setEditing(true)}
              disabled={loading}
            >
              Edit details
            </button>

            <button
              type="button"
              className="danger-button"
              onClick={handleDelete}
              disabled={loading}
            >
              {loading ? "Processing..." : "Delete beneficiary"}
            </button>
          </div>
        </>
      )}
    </section>
  );
}

export default BeneficiaryCard;