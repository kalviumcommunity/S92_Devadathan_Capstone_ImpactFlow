import { useMemo, useState } from "react";
import { API_URL } from "../config";

const initialPrograms = [
  {
    id: "program-education",
    name: "Shiksha Saathi",
    focus: "Education",
    location: "Chennai & Chengalpattu",
    beneficiaries: 284,
    budget: 1800000,
    spendPercent: 72,
    startDate: "2026-04-01",
    endDate: "2027-03-31",
    status: "Active",
  },
  {
    id: "program-health",
    name: "Aarogya on Wheels",
    focus: "Community health",
    location: "Kanchipuram district",
    beneficiaries: 640,
    budget: 2450000,
    spendPercent: 61,
    startDate: "2026-01-15",
    endDate: "2026-12-31",
    status: "Active",
  },
  {
    id: "program-livelihood",
    name: "Sakhi Livelihood Circles",
    focus: "Livelihoods",
    location: "Tiruvallur district",
    beneficiaries: 156,
    budget: 1250000,
    spendPercent: 48,
    startDate: "2026-06-01",
    endDate: "2027-05-31",
    status: "Active",
  },
  {
    id: "program-nutrition",
    name: "Nourish Every Child",
    focus: "Child nutrition",
    location: "North Chennai",
    beneficiaries: 198,
    budget: 980000,
    spendPercent: 0,
    startDate: "2026-12-01",
    endDate: "2027-11-30",
    status: "Planning",
  },
];

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  notation: "compact",
  maximumFractionDigits: 1,
});

const number = new Intl.NumberFormat("en-IN");
const date = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

function formatDate(value) {
  return value ? date.format(new Date(`${value}T00:00:00`)) : "Not set";
}

function readPrograms() {
  try {
    const saved = JSON.parse(localStorage.getItem("impactflow-programs"));
    return Array.isArray(saved) ? saved : initialPrograms;
  } catch {
    return initialPrograms;
  }
}

function readSettings() {
  try {
    return JSON.parse(localStorage.getItem("impactflow-settings")) || {
      legalName: "",
      registrationNumber: "",
      panNumber: "",
      csrNumber: "",
      contactEmail: "",
      phone: "",
      location: "",
      financialYear: "April – March",
      emailUpdates: true,
      monthlyDigest: true,
    };
  } catch {
    return {
      legalName: "",
      registrationNumber: "",
      panNumber: "",
      csrNumber: "",
      contactEmail: "",
      phone: "",
      location: "",
      financialYear: "April – March",
      emailUpdates: true,
      monthlyDigest: true,
    };
  }
}

function PageIntro({ eyebrow, title, description, children }) {
  return (
    <section className="page-heading workspace-page-heading">
      <div>
        <span className="page-eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {children}
    </section>
  );
}

function SampleDataNote() {
  return (
    <div className="sample-data-note">
      <span aria-hidden="true">i</span>
      Sample workspace data — replace it with your organisation’s records.
    </div>
  );
}

function ProgramsPage({ token }) {
  const [programs, setPrograms] = useState(readPrograms);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All programs");
  const [showForm, setShowForm] = useState(false);
  const [expandedId, setExpandedId] = useState("");
  const [saveError, setSaveError] = useState("");
  const [aiError, setAiError] = useState("");
  const [generatingDescription, setGeneratingDescription] = useState(false);
  const [form, setForm] = useState({
    name: "",
    focus: "",
    location: "",
    description: "",
    beneficiaries: "",
    budget: "",
    startDate: "",
    endDate: "",
  });

  const filteredPrograms = useMemo(
    () =>
      programs.filter((program) => {
        const matchesFilter =
          filter === "All programs" || program.status === filter;
        const searchable =
          `${program.name} ${program.focus} ${program.location}`.toLowerCase();
        return matchesFilter && searchable.includes(query.toLowerCase());
      }),
    [filter, programs, query]
  );

  const activePrograms = programs.filter((program) => program.status === "Active");
  const beneficiaries = programs.reduce(
    (total, program) => total + Number(program.beneficiaries || 0),
    0
  );
  const totalBudget = programs.reduce(
    (total, program) => total + Number(program.budget || 0),
    0
  );

  const savePrograms = (nextPrograms) => {
    try {
      localStorage.setItem("impactflow-programs", JSON.stringify(nextPrograms));
      setPrograms(nextPrograms);
      setSaveError("");
      return true;
    } catch {
      setSaveError("Your browser couldn't save this change. Check available storage and try again.");
      return false;
    }
  };

  const handleCreate = (event) => {
    event.preventDefault();
    const nextPrograms = [
      {
        ...form,
        id: `program-${Date.now()}`,
        beneficiaries: Number(form.beneficiaries),
        budget: Number(form.budget),
        spendPercent: 0,
        status: "Planning",
      },
      ...programs,
    ];

    if (savePrograms(nextPrograms)) {
      setShowForm(false);
      setForm({
        name: "",
        focus: "",
        location: "",
        description: "",
        beneficiaries: "",
        budget: "",
        startDate: "",
        endDate: "",
      });
    }
  };

  const handleGenerateDescription = async () => {
    setAiError("");
    setGeneratingDescription(true);

    try {
      const response = await fetch(`${API_URL}/api/ai/program-description`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: form.name,
          focus: form.focus,
          location: form.location,
        }),
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.message || "AI could not draft the description.");
      }

      setForm((current) => ({ ...current, description: result.description }));
    } catch (error) {
      setAiError(
        error instanceof TypeError
          ? `ImpactFlow API isn't reachable at ${API_URL}.`
          : error.message || "AI could not draft the description. Please try again."
      );
    } finally {
      setGeneratingDescription(false);
    }
  };

  return (
    <>
      <PageIntro
        eyebrow="PROGRAMME DELIVERY"
        title="Programs"
        description="Plan initiatives, track delivery, and keep every team aligned on the work that matters."
      >
        <button
          className="primary-button"
          type="button"
          onClick={() => setShowForm((visible) => !visible)}
        >
          {showForm ? "Cancel" : "+ Create program"}
        </button>
      </PageIntro>

      <SampleDataNote />

      <section className="workspace-metrics-grid" aria-label="Program summary">
        <article className="workspace-metric">
          <span className="workspace-metric-icon metric-green" aria-hidden="true">◈</span>
          <span className="workspace-metric-label">Active programs</span>
          <strong>{String(activePrograms.length).padStart(2, "0")}</strong>
          <span className="workspace-metric-caption">Currently delivering</span>
        </article>
        <article className="workspace-metric">
          <span className="workspace-metric-icon metric-blue" aria-hidden="true">♙</span>
          <span className="workspace-metric-label">People reached</span>
          <strong>{number.format(beneficiaries)}</strong>
          <span className="workspace-metric-caption">Across all initiatives</span>
        </article>
        <article className="workspace-metric">
          <span className="workspace-metric-icon metric-amber" aria-hidden="true">₹</span>
          <span className="workspace-metric-label">Portfolio budget</span>
          <strong>{currency.format(totalBudget)}</strong>
          <span className="workspace-metric-caption">Allocated across programs</span>
        </article>
      </section>

      {showForm && (
        <section className="workspace-panel program-form-panel">
          <div className="workspace-panel-heading">
            <div>
              <span className="panel-eyebrow">NEW INITIATIVE</span>
              <h2>Set up a program</h2>
              <p>Start with the essentials. You can refine delivery details later.</p>
            </div>
          </div>
          <form className="workspace-form-grid" onSubmit={handleCreate}>
            <label className="workspace-field">
              Program name
              <input
                autoFocus
                required
                maxLength="160"
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                placeholder="e.g. Community learning centres"
              />
            </label>
            <label className="workspace-field">
              Focus area
              <input
                required
                maxLength="160"
                value={form.focus}
                onChange={(event) => setForm({ ...form, focus: event.target.value })}
                placeholder="Education, health, livelihoods…"
              />
            </label>
            <label className="workspace-field">
              Location
              <input
                required
                maxLength="160"
                value={form.location}
                onChange={(event) => setForm({ ...form, location: event.target.value })}
                placeholder="District or community"
              />
            </label>
            <div className="workspace-field program-description-field">
              <label htmlFor="program-description">Program description</label>
              <textarea
                id="program-description"
                rows="4"
                maxLength="1200"
                value={form.description}
                onChange={(event) =>
                  setForm({ ...form, description: event.target.value })
                }
                placeholder="Describe the need, activities, and intended community benefit."
              />
              <div className="program-ai-actions">
                <button
                  className="secondary-button"
                  type="button"
                  onClick={handleGenerateDescription}
                  disabled={
                    generatingDescription ||
                    !form.name.trim() ||
                    !form.focus.trim() ||
                    !form.location.trim()
                  }
                >
                  {generatingDescription ? "Drafting…" : "Draft with AI"}
                </button>
                <span>Uses program details only. Do not include beneficiary personal information.</span>
              </div>
              {aiError && <p className="workspace-save-error" role="alert">{aiError}</p>}
            </div>
            <label className="workspace-field">
              Planned participants
              <input
                required
                min="1"
                type="number"
                value={form.beneficiaries}
                onChange={(event) => setForm({ ...form, beneficiaries: event.target.value })}
                placeholder="0"
              />
            </label>
            <label className="workspace-field">
              Approved budget (₹)
              <input
                required
                min="1"
                type="number"
                value={form.budget}
                onChange={(event) => setForm({ ...form, budget: event.target.value })}
                placeholder="0"
              />
            </label>
            <label className="workspace-field">
              Start date
              <input
                required
                type="date"
                value={form.startDate}
                onChange={(event) => setForm({ ...form, startDate: event.target.value })}
              />
            </label>
            <label className="workspace-field">
              Planned end date
              <input
                required
                type="date"
                min={form.startDate || undefined}
                value={form.endDate}
                onChange={(event) => setForm({ ...form, endDate: event.target.value })}
              />
            </label>
            <div className="workspace-form-actions">
              {saveError && <p className="workspace-save-error" role="alert">{saveError}</p>}
              <button className="primary-button" type="submit">Save program</button>
            </div>
          </form>
        </section>
      )}

      <section className="workspace-panel">
        <div className="workspace-panel-heading program-list-heading">
          <div>
            <span className="panel-eyebrow">YOUR PORTFOLIO</span>
            <h2>Program register</h2>
            <p>Keep objectives, reach, and budget status visible in one place.</p>
          </div>
          <label className="program-search">
            <span className="sr-only">Search programs</span>
            <span aria-hidden="true">⌕</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search programs"
            />
          </label>
        </div>
        <div className="program-filters" role="group" aria-label="Filter programs">
          {["All programs", "Active", "Planning", "Completed"].map((item) => (
            <button
              key={item}
              type="button"
              className={`program-filter ${filter === item ? "selected" : ""}`}
              onClick={() => setFilter(item)}
              aria-pressed={filter === item}
            >
              {item}
            </button>
          ))}
        </div>
        <div className="program-list">
          {filteredPrograms.map((program) => {
            const expanded = expandedId === program.id;
            const spent = (program.budget * program.spendPercent) / 100;
            return (
              <article className="program-row" key={program.id}>
                <div className="program-row-main">
                  <span className={`program-avatar ${program.focus.toLowerCase().includes("health") ? "avatar-coral" : program.focus.toLowerCase().includes("livelihood") ? "avatar-violet" : "avatar-green"}`} aria-hidden="true">
                    {program.focus.slice(0, 1).toUpperCase()}
                  </span>
                  <div className="program-name-block">
                    <div className="program-title-line">
                      <h3>{program.name}</h3>
                      <span className={`program-status status-${program.status.toLowerCase()}`}>
                        <span />
                        {program.status}
                      </span>
                    </div>
                    <p>{program.focus} <span>·</span> {program.location}</p>
                  </div>
                  <div className="program-stat">
                    <span>Participants</span>
                    <strong>{number.format(program.beneficiaries)}</strong>
                  </div>
                  <div className="program-stat program-budget">
                    <span>Budget used</span>
                    <strong>{currency.format(spent)} <small>of {currency.format(program.budget)}</small></strong>
                    <div className="budget-track" aria-label={`${program.spendPercent}% of budget used`}>
                      <span style={{ width: `${program.spendPercent}%` }} />
                    </div>
                  </div>
                  <button
                    className="program-expand"
                    type="button"
                    aria-label={`${expanded ? "Hide" : "View"} ${program.name} details`}
                    aria-expanded={expanded}
                    onClick={() => setExpandedId(expanded ? "" : program.id)}
                  >
                    {expanded ? "−" : "+"}
                  </button>
                </div>
                {expanded && (
                  <div className="program-detail">
                    {program.description && (
                      <div className="program-description-detail">
                        <span>Program description</span>
                        <p>{program.description}</p>
                      </div>
                    )}
                    <div><span>Delivery period</span><strong>{formatDate(program.startDate)} — {formatDate(program.endDate)}</strong></div>
                    <div><span>Approved allocation</span><strong>{currency.format(program.budget)}</strong></div>
                    <div><span>Budget remaining</span><strong>{currency.format(program.budget - spent)}</strong></div>
                  </div>
                )}
              </article>
            );
          })}
          {filteredPrograms.length === 0 && (
            <div className="workspace-empty-state">
              <span aria-hidden="true">⌕</span>
              <h3>No matching programs</h3>
              <p>Try another search or choose a different status filter.</p>
            </div>
          )}
        </div>
        <p className="workspace-storage-note">Changes are saved in this browser on this device.</p>
        {saveError && <p className="workspace-save-error" role="alert">{saveError}</p>}
      </section>
    </>
  );
}

function ReportsPage() {
  const [programs] = useState(readPrograms);
  const [filter, setFilter] = useState("All programs");
  const reportPrograms = programs.filter(
    (program) => filter === "All programs" || program.status === filter
  );
  const peopleReached = reportPrograms.reduce(
    (total, program) => total + Number(program.beneficiaries || 0),
    0
  );
  const totalBudget = reportPrograms.reduce(
    (total, program) => total + Number(program.budget || 0),
    0
  );
  const committed = reportPrograms.reduce(
    (total, program) =>
      total + (Number(program.budget || 0) * Number(program.spendPercent || 0)) / 100,
    0
  );
  const averageSpend = totalBudget ? Math.round((committed / totalBudget) * 100) : 0;
  const maxReach = Math.max(...reportPrograms.map((program) => program.beneficiaries), 1);
  const maxBudget = Math.max(...reportPrograms.map((program) => program.budget), 1);

  const downloadCsv = () => {
    const rows = [
      ["Program", "Focus area", "Location", "Status", "Participants", "Approved budget (INR)", "Budget used (%)"],
      ...reportPrograms.map((program) => [
        program.name,
        program.focus,
        program.location,
        program.status,
        program.beneficiaries,
        program.budget,
        program.spendPercent,
      ]),
    ];
    const csv = rows.map((row) =>
      row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(",")
    ).join("\r\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "impactflow-program-report.csv";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <>
      <PageIntro
        eyebrow="ACCOUNTABILITY & LEARNING"
        title="Reports & analytics"
        description="Turn programme records into clear, shareable insights for your team, partners, and supporters."
      >
        <button className="secondary-button report-export-button" type="button" onClick={downloadCsv}>
          <span aria-hidden="true">↓</span> Export CSV
        </button>
      </PageIntro>
      <SampleDataNote />

      <section className="report-toolbar">
        <div>
          <strong>Programme portfolio</strong>
          <span>Summary from your saved program register</span>
        </div>
        <label>
          <span className="sr-only">Filter report by program status</span>
          <select value={filter} onChange={(event) => setFilter(event.target.value)}>
            <option>All programs</option>
            <option>Active</option>
            <option>Planning</option>
            <option>Completed</option>
          </select>
        </label>
      </section>

      <section className="workspace-metrics-grid report-metrics" aria-label="Portfolio indicators">
        <article className="workspace-metric">
          <span className="workspace-metric-icon metric-green" aria-hidden="true">♙</span>
          <span className="workspace-metric-label">People reached</span>
          <strong>{number.format(peopleReached)}</strong>
          <span className="workspace-metric-caption">Participants recorded in selected programs</span>
        </article>
        <article className="workspace-metric">
          <span className="workspace-metric-icon metric-blue" aria-hidden="true">◈</span>
          <span className="workspace-metric-label">Programs in view</span>
          <strong>{String(reportPrograms.length).padStart(2, "0")}</strong>
          <span className="workspace-metric-caption">Portfolio entries included</span>
        </article>
        <article className="workspace-metric">
          <span className="workspace-metric-icon metric-amber" aria-hidden="true">₹</span>
          <span className="workspace-metric-label">Budget utilisation</span>
          <strong>{averageSpend}%</strong>
          <span className="workspace-metric-caption">{currency.format(committed)} of {currency.format(totalBudget)} allocated</span>
        </article>
      </section>

      <section className="reports-grid">
        <article className="workspace-panel report-chart-panel">
          <div className="workspace-panel-heading">
            <div>
              <span className="panel-eyebrow">REACH</span>
              <h2>Participants by program</h2>
              <p>Recorded participants across the selected portfolio.</p>
            </div>
          </div>
          <div className="horizontal-chart">
            {reportPrograms.map((program) => (
              <div className="horizontal-chart-row" key={program.id}>
                <div className="horizontal-chart-label">
                  <span>{program.name}</span>
                  <strong>{number.format(program.beneficiaries)}</strong>
                </div>
                <div className="horizontal-chart-track">
                  <span style={{ width: `${(program.beneficiaries / maxReach) * 100}%` }} />
                </div>
              </div>
            ))}
            {reportPrograms.length === 0 && <p className="chart-empty">No programs match this filter.</p>}
          </div>
          <p className="chart-footnote">Counts may include individuals or households; use a consistent unit in your organisation’s records.</p>
        </article>

        <article className="workspace-panel report-budget-panel">
          <div className="workspace-panel-heading">
            <div>
              <span className="panel-eyebrow">FINANCIAL STEWARDSHIP</span>
              <h2>Budget by program</h2>
              <p>Approved allocations and recorded utilisation.</p>
            </div>
          </div>
          <div className="budget-chart-list">
            {reportPrograms.map((program, index) => (
              <div className="budget-chart-item" key={program.id}>
                <div className="budget-chart-head">
                  <span className={`budget-legend-dot budget-color-${index % 4}`} />
                  <span>{program.name}</span>
                  <strong>{currency.format(program.budget)}</strong>
                </div>
                <div className="budget-chart-track">
                  <span style={{ width: `${(program.budget / maxBudget) * 100}%` }} />
                  <i style={{ width: `${(program.budget / maxBudget) * program.spendPercent}%` }} />
                </div>
                <small>{program.spendPercent}% utilised · {currency.format((program.budget * program.spendPercent) / 100)} recorded spend</small>
              </div>
            ))}
            {reportPrograms.length === 0 && <p className="chart-empty">No programs match this filter.</p>}
          </div>
          <div className="budget-legend">
            <span><i /> Approved allocation</span>
            <span><i /> Recorded spend</span>
          </div>
        </article>
      </section>

      <section className="report-note-panel">
        <div className="report-note-icon" aria-hidden="true">✓</div>
        <div>
          <strong>Make every number accountable</strong>
          <p>Keep participant counts, reporting periods, and supporting documents consistent before sharing reports externally.</p>
        </div>
      </section>
    </>
  );
}

function SettingsPage({ user }) {
  const [settings, setSettings] = useState(readSettings);
  const [saveState, setSaveState] = useState("");

  const updateField = (field, value) => {
    setSettings((current) => ({ ...current, [field]: value }));
    setSaveState("");
  };

  const handleSave = (event) => {
    event.preventDefault();
    try {
      localStorage.setItem("impactflow-settings", JSON.stringify(settings));
      setSaveState("Settings saved in this browser.");
    } catch {
      setSaveState("We couldn't save your settings. Check available browser storage and try again.");
    }
  };

  return (
    <>
      <PageIntro
        eyebrow="WORKSPACE ADMINISTRATION"
        title="Settings"
        description="Keep your organisation profile and team preferences accurate and ready for day-to-day operations."
      />
      <SampleDataNote />

      <div className="settings-layout">
        <form className="workspace-panel settings-form" onSubmit={handleSave}>
          <div className="workspace-panel-heading">
            <div>
              <span className="panel-eyebrow">ORGANISATION PROFILE</span>
              <h2>Registered details</h2>
              <p>Use the legal details your organisation uses for records and partner communication.</p>
            </div>
          </div>
          <div className="workspace-form-grid settings-fields">
            <label className="workspace-field settings-field-wide">
              Legal organisation name
              <input value={settings.legalName} onChange={(event) => updateField("legalName", event.target.value)} placeholder="As shown on registration documents" />
            </label>
            <label className="workspace-field">
              Registration number
              <input value={settings.registrationNumber} onChange={(event) => updateField("registrationNumber", event.target.value)} placeholder="Trust / Society / Section 8 number" />
            </label>
            <label className="workspace-field">
              PAN (optional)
              <input value={settings.panNumber} onChange={(event) => updateField("panNumber", event.target.value.toUpperCase())} placeholder="Organisation PAN" autoCapitalize="characters" />
            </label>
            <label className="workspace-field">
              CSR-1 number (optional)
              <input value={settings.csrNumber} onChange={(event) => updateField("csrNumber", event.target.value)} placeholder="For CSR-funded programmes" />
            </label>
            <label className="workspace-field">
              Public contact email
              <input type="email" value={settings.contactEmail} onChange={(event) => updateField("contactEmail", event.target.value)} placeholder="contact@yourngo.org" />
            </label>
            <label className="workspace-field">
              Contact phone
              <input type="tel" value={settings.phone} onChange={(event) => updateField("phone", event.target.value)} placeholder="+91" />
            </label>
            <label className="workspace-field">
              Primary operating location
              <input value={settings.location} onChange={(event) => updateField("location", event.target.value)} placeholder="City, state" />
            </label>
            <label className="workspace-field">
              Financial year
              <select value={settings.financialYear} onChange={(event) => updateField("financialYear", event.target.value)}>
                <option>April – March</option>
                <option>January – December</option>
                <option>July – June</option>
                <option>October – September</option>
              </select>
            </label>
          </div>
          <div className="settings-divider" />
          <div className="workspace-panel-heading settings-preference-heading">
            <div>
              <span className="panel-eyebrow">COMMUNICATIONS</span>
              <h2>Workspace preferences</h2>
              <p>Choose the operational updates you want this workspace to prepare.</p>
            </div>
          </div>
          <label className="settings-toggle">
            <span><strong>Program and review reminders</strong><small>Prepare reminders for upcoming program dates and reviews.</small></span>
            <input type="checkbox" checked={settings.emailUpdates} onChange={(event) => updateField("emailUpdates", event.target.checked)} />
          </label>
          <label className="settings-toggle">
            <span><strong>Monthly activity summary</strong><small>Prepare a monthly overview for workspace administrators.</small></span>
            <input type="checkbox" checked={settings.monthlyDigest} onChange={(event) => updateField("monthlyDigest", event.target.checked)} />
          </label>
          <div className="settings-save-row">
            <span className={saveState.includes("saved") ? "save-success" : "workspace-save-error"} role={saveState ? "status" : undefined}>{saveState}</span>
            <button className="primary-button" type="submit">Save settings</button>
          </div>
          <p className="workspace-storage-note">These settings are stored in this browser on this device; they are not yet synced to a shared NGO account.</p>
        </form>

        <aside className="settings-side-column">
          <section className="workspace-panel account-card">
            <span className="account-card-icon" aria-hidden="true">✓</span>
            <span className="panel-eyebrow">SIGNED-IN ACCOUNT</span>
            <h2>{user?.name || "Workspace member"}</h2>
            <p>{user?.email || user?.username || "Account email not available"}</p>
            <div className="account-status"><span /> Session active</div>
          </section>
          <section className="settings-guidance-card">
            <span aria-hidden="true">✳</span>
            <h3>Good records build trust</h3>
            <p>Keep registration details and contact information aligned with your organisation’s official documents before sharing them with partners.</p>
          </section>
        </aside>
      </div>
    </>
  );
}

export { ProgramsPage, ReportsPage, SettingsPage };
