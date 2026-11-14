function Footer() {
  return (
    <footer className="app-footer">
      <p>
        © {new Date().getFullYear()} <strong>ImpactFlow</strong>. All rights
        reserved.
      </p>

      <div className="footer-links">
        <span>Built for social impact</span>
        <span className="footer-divider">·</span>
        <span>NGO Management Platform</span>
      </div>
    </footer>
  );
}

export default Footer;
