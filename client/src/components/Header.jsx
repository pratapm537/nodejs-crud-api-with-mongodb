import { Link } from 'react-router-dom';

function Header() {
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-custom sticky-top">
          <div className="container-fluid px-4 px-lg-5 d-flex justify-content-between align-items-center">
              <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
                  <div style={{ width: '32px', height: '32px', background: 'var(--accent-primary)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                      <i className="bi bi-person-lines-fill fs-5"></i>
                  </div>
                  <span className="brand-text">ContactHub</span>
              </Link>
              <button className="navbar-toggler shadow-none border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                  <i className="bi bi-list fs-2 text-dark"></i>
              </button>
              <div className="collapse navbar-collapse flex-grow-0" id="navbarNav">
                  <ul className="navbar-nav align-items-center gap-3">
                      <li className="nav-item">
                          <Link className="nav-link" to="/">Dashboard</Link>
                      </li>
                      <li className="nav-item">
                          <Link to="/add-contact" className="btn btn-primary-custom d-flex align-items-center gap-2 shadow-sm">
                              <i className="bi bi-plus-lg"></i> New Contact
                          </Link>
                      </li>
                  </ul>
              </div>
          </div>
      </nav>
    </>
  );
}

export default Header;
