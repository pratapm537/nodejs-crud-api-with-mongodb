import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import api from '../api';

function ShowContact() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [contact, setContact] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchContact = async () => {
            try {
                const { data } = await api.get(`/${id}`);
                setContact(data.contact);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching contact:", error);
                alert("Failed to load contact details.");
                navigate('/');
            }
        };
        fetchContact();
    }, [id, navigate]);

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this contact?')) {
            try {
                await api.delete(`/${id}`);
                navigate('/');
            } catch (error) {
                console.error("Error deleting contact:", error);
                alert("Failed to delete contact.");
            }
        }
    };

    if (loading) return <Layout><div className="text-center py-5">Loading...</div></Layout>;
    if (!contact) return <Layout><div className="text-center py-5">Contact not found</div></Layout>;

    return (
        <Layout>
            <div className="container-fluid px-4 px-lg-5 py-5">
                <div className="row justify-content-center">
                    <div className="col-lg-6 col-md-8">
                        
                        <div className="d-flex align-items-center mb-4 gap-3">
                            <Link to="/" className="btn btn-outline-custom rounded-circle" style={{ width: '40px', height: '40px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '0' }}>
                                <i className="bi bi-arrow-left"></i>
                            </Link>
                            <h2 className="mb-0 fw-bold text-dark">Contact Profile</h2>
                        </div>
                        
                        <div className="glass-card overflow-hidden bg-white border-0 shadow-sm">
                            {/* Profile Header Banner */}
                            <div style={{ height: '120px', backgroundColor: 'var(--accent-primary)', position: 'relative' }}>
                                <div style={{ position: 'absolute', bottom: '-40px', left: '40px', width: '80px', height: '80px', background: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '4px solid white', boxShadow: 'var(--shadow-sm)' }}>
                                    <i className="bi bi-person-fill" style={{ fontSize: '2.5rem', color: 'var(--text-secondary)' }}></i>
                                </div>
                            </div>

                            {/* Profile Content */}
                            <div className="p-4 p-md-5 pt-5 mt-2">
                                <h3 className="fw-bold mb-1 text-dark">{contact.first_name} {contact.last_name}</h3>
                                <p className="text-muted mb-4"><i className="bi bi-circle-fill me-2" style={{ fontSize: '0.5rem', color: 'var(--success)', verticalAlign: 'middle' }}></i> Active Connection</p>

                                <div className="row g-4 border-top pt-4">
                                    <div className="col-sm-6">
                                        <p className="text-secondary fw-semibold mb-1 fs-6">Email Address</p>
                                        <p className="fs-6 mb-0 text-break">
                                            <a href={`mailto:${contact.email}`} style={{ color: 'var(--text-primary)', textDecoration: 'none' }}>{contact.email}</a>
                                        </p>
                                    </div>
                                    <div className="col-sm-6">
                                        <p className="text-secondary fw-semibold mb-1 fs-6">Phone Number</p>
                                        <p className="fs-6 mb-0">
                                            <a href={`tel:${contact.phone}`} style={{ color: 'var(--text-primary)', textDecoration: 'none' }}>{contact.phone}</a>
                                        </p>
                                    </div>
                                    <div className="col-12">
                                        <p className="text-secondary fw-semibold mb-1 fs-6">Physical Address</p>
                                        <p className="fs-6 mb-0 text-dark" style={{ lineHeight: '1.6' }}>
                                            {contact.address}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Profile Actions */}
                            <div className="bg-light p-4 d-flex justify-content-end gap-3 border-top">
                                <Link to={`/update-contact/${contact._id}`} className="btn btn-outline-custom d-flex align-items-center gap-2 bg-white">
                                    <i className="bi bi-pencil-square"></i> Edit
                                </Link>
                                <button onClick={handleDelete} className="btn btn-danger d-flex align-items-center gap-2 shadow-sm">
                                    <i className="bi bi-trash3"></i> Delete
                                </button>
                            </div>
                        </div>
                        
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default ShowContact;
