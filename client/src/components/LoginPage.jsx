import { useState } from "react";
import { API_URL } from "../config";

function GoogleMark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 48 48" className="google-mark">
      <path
        fill="#4285F4"
        d="M43.6 24.5c0-1.4-.1-2.8-.4-4.1H24v7.8h11a9.4 9.4 0 0 1-4.1 6.2v5.1h6.6c3.9-3.6 6.1-8.8 6.1-15Z"
      />
      <path
        fill="#34A853"
        d="M24 44c5.5 0 10.1-1.8 13.5-4.9l-6.6-5.1c-1.8 1.2-4.1 2-6.9 2-5.3 0-9.8-3.6-11.4-8.4H5.8v5.3A20 20 0 0 0 24 44Z"
      />
      <path
        fill="#FBBC05"
        d="M12.6 27.6a12 12 0 0 1 0-7.2v-5.3H5.8a20 20 0 0 0 0 17.8l6.8-5.3Z"
      />
      <path
        fill="#EA4335"
        d="M24 12c3 0 5.7 1 7.8 3.1l5.9-5.9A19.7 19.7 0 0 0 24 4 20 20 0 0 0 5.8 15.1l6.8 5.3C14.2 15.6 18.7 12 24 12Z"
      />
    </svg>
  );
}

function LoginPage({ onLogin, authError }) {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const isSignup = mode === "signup";

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    if (isSignup && password !== confirmPassword) {
      setError("Your passwords don't match. Please check and try again.");
      setSubmitting(false);
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/auth/${isSignup ? "register" : "login"}`,
        {
        method: "POST",
        headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: email.trim().toLowerCase(),
            password,
            ...(isSignup ? { name: name.trim() } : {}),
          }),
        }
      );
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message ||
            `Unable to ${isSignup ? "create your account" : "sign in"}. Please try again.`
        );
      }

      if (!data.token) {
        throw new Error("The server did not return a sign-in token. Please try again.");
      }

      onLogin({
        token: data.token,
        user: data.user || { name: isSignup ? name.trim() : email.trim() },
      });
    } catch (loginError) {
      setError(
        loginError instanceof TypeError
          ? `ImpactFlow API isn't reachable at ${API_URL}. Start the server and try again.`
          : loginError.message ||
            `Unable to ${isSignup ? "create your account" : "sign in"}. Please try again.`
      );
    } finally {
      setSubmitting(false);
    }
  };

  const changeMode = (nextMode) => {
    setMode(nextMode);
    setError("");
    setPassword("");
    setConfirmPassword("");
  };

  const handleGoogleSignIn = async () => {
    setRedirecting(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/auth/status`);
      if (!response.ok) {
        throw new Error(
          `ImpactFlow API returned HTTP ${response.status}. Restart the server and try again.`
        );
      }
      const status = await response.json().catch(() => null);
      if (!status) {
        throw new Error("ImpactFlow API returned an unreadable sign-in status. Restart the server and try again.");
      }
      if (!status.googleConfigured) {
        throw new Error(
          "Google sign-in isn't configured yet. Ask your administrator to check the Google OAuth settings."
        );
      }
      window.location.assign(`${API_URL}/auth/google`);
    } catch (signInError) {
      setError(
        signInError instanceof TypeError
          ? `ImpactFlow API isn't reachable at ${API_URL}. Start the server and try again.`
          : signInError.message || "Google sign-in could not be started. Please try again."
      );
      setRedirecting(false);
    }
  };

  return (
    <main className="login-page">
      <section className="login-story" aria-label="About ImpactFlow">
        <a className="login-brand" href="/" aria-label="ImpactFlow home">
          <img src="/impactflow-logo.svg" alt="" />
        </a>

        <div className="story-content">
          <span className="story-eyebrow">
            <span className="story-eyebrow-dot" />
            BETTER TOGETHER
          </span>
          <h1>
            Make every act
            <br />
            of giving <span>count.</span>
          </h1>
          <p>
            A clearer view of your work. A stronger connection to the
            communities you serve.
          </p>

          <div className="impact-card">
            <div className="impact-card-top">
              <span className="impact-icon" aria-hidden="true">
                ↗
              </span>
              <span>YOUR IMPACT, IN FOCUS</span>
            </div>
            <strong>Small steps. Lasting change.</strong>
            <div className="impact-progress" aria-hidden="true">
              <span />
            </div>
            <div className="impact-card-bottom">
              <span>Community programs</span>
              <span>Growing every day</span>
            </div>
          </div>
        </div>

        <div className="story-footer">
          <span>Built for the people building a better future.</span>
          <span className="story-sparkle" aria-hidden="true">
            ✳
          </span>
        </div>
        <span className="story-orb story-orb-one" aria-hidden="true" />
        <span className="story-orb story-orb-two" aria-hidden="true" />
      </section>

      <section className="login-panel">
        <div className="login-form-wrap">
          <div className="login-mobile-brand">
            <img src="/impactflow-logo.svg" alt="" />
          </div>
          <div className="login-heading">
            <span className="login-kicker">
              {isSignup ? "LET'S MAKE AN IMPACT" : "WELCOME BACK"}
            </span>
            <h2>{isSignup ? "Create your account" : "Sign in to your workspace"}</h2>
            <p>
              {isSignup
                ? "Create your account to organise your community work in one place."
                : "Your mission is moving forward. Let’s pick up where you left off."}
            </p>
          </div>

          <div className="auth-mode-switch" role="tablist" aria-label="Account access">
            <button
              type="button"
              role="tab"
              aria-selected={!isSignup}
              className={!isSignup ? "selected" : ""}
              onClick={() => changeMode("login")}
            >
              Sign in
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={isSignup}
              className={isSignup ? "selected" : ""}
              onClick={() => changeMode("signup")}
            >
              Create account
            </button>
          </div>

          {(error || authError) && (
            <div className="login-error" role="alert">
              {error || authError}
            </div>
          )}

          <button
            className="google-signin-button"
            type="button"
            onClick={handleGoogleSignIn}
            disabled={redirecting || submitting}
          >
            <GoogleMark />
            {redirecting ? "Connecting to Google..." : "Continue with Google"}
          </button>

          <div className="login-divider">
            <span>{isSignup ? "or sign up with email" : "or sign in with email"}</span>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            {isSignup && (
              <label className="login-field">
                <span>Full name</span>
                <input
                  type="text"
                  name="name"
                  autoComplete="name"
                  placeholder="Your name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                />
              </label>
            )}
            <label className="login-field">
              <span>{isSignup ? "Email address" : "Email or username"}</span>
              <input
                type={isSignup ? "email" : "text"}
                name={isSignup ? "email" : "username"}
                autoComplete={isSignup ? "email" : "username"}
                placeholder={
                  isSignup ? "you@yourngo.org" : "you@yourngo.org or username"
                }
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </label>

            <label className="login-field">
              <span>Password</span>
              <input
                type="password"
                name="password"
                autoComplete={isSignup ? "new-password" : "current-password"}
                minLength={isSignup ? 8 : undefined}
                placeholder={isSignup ? "At least 8 characters" : "Enter your password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </label>

            {isSignup && (
              <label className="login-field">
                <span>Confirm password</span>
                <input
                  type="password"
                  name="confirm-password"
                  autoComplete="new-password"
                  minLength="8"
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  required
                />
              </label>
            )}

            <button
              className="login-submit-button"
              type="submit"
              disabled={submitting || redirecting}
            >
              {submitting
                ? isSignup ? "Creating account..." : "Signing in..."
                : isSignup ? "Create account" : "Sign in"}
              {!submitting && <span aria-hidden="true">→</span>}
            </button>
          </form>

          <p className="auth-mode-prompt">
            {isSignup ? "Already have an account?" : "New to ImpactFlow?"}{" "}
            <button
              type="button"
              onClick={() => changeMode(isSignup ? "login" : "signup")}
            >
              {isSignup ? "Sign in" : "Create an account"}
            </button>
          </p>

          <p className="login-security-note">
            <span aria-hidden="true">⌑</span>
            Your workspace is private and secure.
          </p>
        </div>
        <footer className="login-copyright">
          © {new Date().getFullYear()} ImpactFlow <span>·</span> Here for a
          greater good
        </footer>
      </section>
    </main>
  );
}

export default LoginPage;
