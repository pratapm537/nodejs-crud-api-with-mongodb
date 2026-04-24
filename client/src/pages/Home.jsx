import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Layout from '../components/Layout';
import api from '../api';

function Home() {
    const [contacts, setContacts] = useState([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const [totalPages, setTotalPages] = useState(1);
    const [totalContacts, setTotalContacts] = useState(0);
    const [searchInput, setSearchInput] = useState('');
    const [fieldInput, setFieldInput] = useState('all');
    const [importFile, setImportFile] = useState(null);
    const [importStatus, setImportStatus] = useState(null);
    const [isImporting, setIsImporting] = useState(false);
    const [fileInputKey, setFileInputKey] = useState(0);

    const currentPage = parseInt(searchParams.get('page')) || 1;
    const searchQuery = searchParams.get('q') || '';
    const searchField = searchParams.get('field') || 'all';

    useEffect(() => {
        fetchContacts();
    }, [currentPage, searchQuery, searchField]);

    useEffect(() => {
        setSearchInput(searchQuery);
        setFieldInput(searchField);
    }, [searchQuery, searchField]);

    const fetchContacts = async () => {
        try {
            const { data } = await api.get('/', {
                params: {
                    page: currentPage,
                    q: searchQuery || undefined,
                    field: searchField !== 'all' ? searchField : undefined
                }
            });
            setContacts(data.contacts);
            setTotalPages(data.totalPages);
            setTotalContacts(data.totalContacts);
        } catch (error) {
            console.error("Error fetching contacts:", error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this contact?')) {
            try {
                await api.delete(`/${id}`);
                fetchContacts();
            } catch (error) {
                console.error("Error deleting contact:", error);
            }
        }
    };

    const buildQueryString = (page) => {
        const params = new URLSearchParams();
        if (page && page > 1) params.set('page', String(page));
        if (searchQuery) params.set('q', searchQuery);
        if (searchField && searchField !== 'all') params.set('field', searchField);
        const qs = params.toString();
        return qs ? `/?${qs}` : '/';
    };

    const handleSearchSubmit = (event) => {
        event.preventDefault();
        const trimmed = searchInput.trim();
        const params = new URLSearchParams();
        params.set('page', '1');
        if (trimmed) params.set('q', trimmed);
        if (fieldInput && fieldInput !== 'all') params.set('field', fieldInput);
        setSearchParams(params);
    };

    const handleSearchReset = () => {
        setSearchInput('');
        setFieldInput('all');
        setSearchParams(new URLSearchParams());
    };

    const handleImport = async (event) => {
        event.preventDefault();
        setImportStatus(null);
        if (!importFile) {
            setImportStatus({ type: 'error', message: 'Please select a CSV or Excel file first.' });
            return;
        }

        const formData = new FormData();
        formData.append('file', importFile);
        setIsImporting(true);

        try {
            const { data } = await api.post('/import', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setImportStatus({
                type: 'success',
                message: `Imported ${data.inserted} contact${data.inserted === 1 ? '' : 's'} successfully.`
            });
            setImportFile(null);
            setFileInputKey((prev) => prev + 1);
            fetchContacts();
        } catch (error) {
            const message = error?.response?.data?.message || 'Import failed. Please try again.';
            setImportStatus({ type: 'error', message });
        } finally {
            setIsImporting(false);
        }
    };

    return (
        <Layout>
            <div className="hero-section">
                <div className="container-fluid px-4 px-lg-5">
                    <h1 className="hero-title">
                        <span style={{ color: 'var(--text-primary)' }}>Manage Connections</span><br />
                        <span style={{ color: 'var(--accent-primary)' }}>Effortlessly</span>
                    </h1>
                    <p className="hero-subtitle mt-3">
                        Build your network with our premium, elegant contact manager. Add, update, and securely organize your professional contacts in one clean space.
                    </p>
                    <Link to="/add-contact" className="btn btn-primary-custom px-5 py-3 fs-5 mt-2 shadow-sm d-inline-flex align-items-center gap-2">
                        <i className="bi bi-person-plus-fill"></i> Add New Contact
                    </Link>
                    <a href="http://localhost:8000/api/contacts/download/pdf" download className="btn btn-outline-secondary px-5 py-3 fs-5 mt-2 shadow-sm d-inline-flex align-items-center gap-2 ms-3" style={{ borderRadius: '12px', transition: 'all 0.3s ease', borderColor: 'rgba(79, 70, 229, 0.5)' }}>
                        <i className="bi bi-file-earmark-pdf-fill" style={{ color: 'var(--accent-primary)' }}></i> Download All Records (PDF)
                    </a>
                </div>
            </div>

            <div className="container-fluid px-4 px-lg-5 pb-5">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h3 className="mb-0 fw-bold d-flex align-items-center gap-2" style={{ fontFamily: "'Outfit', sans-serif" }}>
                        <i className="bi bi-people fw-bold text-secondary"></i> All Contacts
                    </h3>
                    <span className="badge" style={{ background: 'rgba(79, 70, 229, 0.1)', color: 'var(--accent-primary)', fontSize: '0.9rem', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid rgba(79, 70, 229, 0.2)' }}>
                        Total: {totalContacts}
                    </span>
                </div>

                <div className="glass-card p-3 mb-4">
                    <div className="row g-3 align-items-center justify-content-between">
                        <div className="col-lg-7 col-xl-6">
                            <form onSubmit={handleSearchSubmit} className="d-flex flex-column flex-md-row gap-2">
                                <div className="input-group">
                                    <span className="input-group-text bg-white border-end-0"><i className="bi bi-search text-muted"></i></span>
                                    <input
                                        type="text"
                                        className="form-control border-start-0 ps-0 shadow-none"
                                        placeholder="Search by name, email, phone..."
                                        value={searchInput}
                                        onChange={(event) => setSearchInput(event.target.value)}
                                    />
                                </div>
                                <select
                                    className="form-select shadow-none"
                                    style={{ width: 'auto', minWidth: '140px' }}
                                    value={fieldInput}
                                    onChange={(event) => setFieldInput(event.target.value)}
                                >
                                    <option value="all">All Fields</option>
                                    <option value="first_name">First Name</option>
                                    <option value="last_name">Last Name</option>
                                    <option value="email">Email</option>
                                    <option value="phone">Phone</option>
                                    <option value="address">Address</option>
                                </select>
                                <div className="d-flex gap-2">
                                    <button type="submit" className="btn btn-primary-custom px-4">Search</button>
                                    <button type="button" className="btn btn-outline-custom px-3" onClick={handleSearchReset} title="Reset Filters"><i className="bi bi-arrow-counterclockwise"></i></button>
                                </div>
                            </form>
                        </div>
                        <div className="col-lg-5 col-xl-6 d-flex flex-column flex-md-row justify-content-lg-end gap-2 align-items-md-center">
                            <div className="d-flex gap-2">
                                <a href="http://localhost:8000/api/contacts/download/csv" className="btn btn-outline-custom d-flex align-items-center gap-1" title="Export CSV">
                                    <i className="bi bi-filetype-csv"></i> <span className="d-none d-xl-inline">CSV</span>
                                </a>
                                <a href="http://localhost:8000/api/contacts/download/excel" className="btn btn-outline-custom d-flex align-items-center gap-1" title="Export Excel">
                                    <i className="bi bi-file-earmark-spreadsheet"></i> <span className="d-none d-xl-inline">Excel</span>
                                </a>
                            </div>
                            <div className="vr d-none d-md-block mx-1" style={{ color: 'var(--border-color)' }}></div>
                            <form onSubmit={handleImport} className="d-flex gap-2">
                                <input
                                    key={fileInputKey}
                                    type="file"
                                    className="form-control"
                                    accept=".csv,.xlsx,.xls"
                                    onChange={(event) => setImportFile(event.target.files?.[0] || null)}
                                    style={{ maxWidth: '220px' }}
                                />
                                <button type="submit" className="btn btn-outline-secondary d-flex align-items-center gap-1" disabled={isImporting}>
                                    <i className="bi bi-cloud-upload"></i> {isImporting ? 'Importing...' : 'Import'}
                                </button>
                            </form>
                        </div>
                    </div>
                    {importStatus && (
                        <div className={`alert ${importStatus.type === 'success' ? 'alert-success' : 'alert-danger'} mt-3 mb-0 py-2 text-center`}>
                            {importStatus.message}
                        </div>
                    )}
                </div>

                <div className="glass-card p-0 overflow-hidden">
                    <div className="table-responsive">
                        <table className="table table-glass table-hover mb-0">
                            <thead>
                                <tr>
                                    <th scope="col" width="5%" className="ps-4">No.</th>
                                    <th scope="col" width="15%">First Name</th>
                                    <th scope="col" width="15%">Last Name</th>
                                    <th scope="col" width="25%">Email Address</th>
                                    <th scope="col" width="15%">Phone</th>
                                    <th scope="col" width="25%" className="pe-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {contacts.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="text-center py-5 text-muted">
                                            <i className="bi bi-inbox fs-1 d-block mb-3" style={{ color: 'var(--border-color)' }}></i>
                                            No contacts found. Click "Add New Contact" to get started.
                                        </td>
                                    </tr>
                                ) : (
                                    contacts.map((contact, idx) => {
                                        const srno = (currentPage - 1) * 5 + idx + 1;
                                        return (
                                            <tr key={contact._id}>
                                                <td className="ps-4"><span className="text-muted fw-semibold">{String(srno).padStart(2, '0')}</span></td>
                                                <td className="fw-semibold text-dark">{contact.first_name}</td>
                                                <td className="fw-semibold text-dark">{contact.last_name}</td>
                                                <td><a href={`mailto:${contact.email}`} style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>{contact.email}</a></td>
                                                <td style={{ color: 'var(--text-secondary)' }}>{contact.phone}</td>
                                                <td className="pe-4">
                                                    <div className="d-flex align-items-center">
                                                        <Link to={`/show-contact/${contact._id}`} className="action-btn view" title="View Profile">
                                                            <i className="bi bi-eye"></i>
                                                        </Link>
                                                        <Link to={`/update-contact/${contact._id}`} className="action-btn edit" title="Edit Contact">
                                                            <i className="bi bi-pencil-square"></i>
                                                        </Link>
                                                        <button onClick={() => handleDelete(contact._id)} className="action-btn delete border-0 bg-transparent" title="Delete Contact">
                                                            <i className="bi bi-trash3"></i>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {totalPages > 1 && (
                    <nav className="mt-4" aria-label="Table pagination">
                        <ul className="pagination justify-content-center">
                            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                <Link className="page-link" to={buildQueryString(currentPage - 1)} style={{ borderRadius: '8px 0 0 8px', color: 'var(--text-primary)', borderColor: 'var(--border-color)' }}>Previous</Link>
                            </li>
                            
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(i => (
                                <li key={i} className={`page-item ${currentPage === i ? 'active' : ''}`}>
                                    <Link className="page-link" to={buildQueryString(i)} style={currentPage === i ? { backgroundColor: 'var(--accent-primary)', borderColor: 'var(--accent-primary)', color: 'white' } : { color: 'var(--text-primary)', borderColor: 'var(--border-color)' }}>{i}</Link>
                                </li>
                            ))}

                            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                <Link className="page-link" to={buildQueryString(currentPage + 1)} style={{ borderRadius: '0 8px 8px 0', color: 'var(--text-primary)', borderColor: 'var(--border-color)' }}>Next</Link>
                            </li>
                        </ul>
                    </nav>
                )}
            </div>
        </Layout>
    );
}

export default Home;
