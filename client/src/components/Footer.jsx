function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-auto py-4" style={{ borderTop: '1px solid var(--border-color)', background: 'var(--bg-surface)' }}>
        <div className="container-fluid px-4 px-lg-5 text-center">
            <p className="mb-0 text-muted" style={{ fontSize: '0.9rem' }}>
                &copy; {year} ContactHub. Crafted with <i className="bi bi-heart-fill text-danger mx-1"></i> for an elegant experience.
            </p>
        </div>
    </footer>
  );
}

export default Footer;
