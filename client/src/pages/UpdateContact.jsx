import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import api from '../api';

function UpdateContact() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        address: ''
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchContact = async () => {
            try {
                const { data } = await api.get(`/${id}`);
                setFormData(data.contact);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching contact:", error);
                alert("Failed to load contact data.");
                navigate('/');
            }
        };
        fetchContact();
    }, [id, navigate]);

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/${id}`, formData);
            navigate('/');
        } catch (error) {
            console.error("Error updating contact:", error);
            alert("Failed to update contact.");
        }
    };

    if (loading) return <Layout><div className="text-center py-5">Loading...</div></Layout>;

    return (
        <Layout>
            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-lg-7 col-md-9">
                        
                        <div className="d-flex align-items-center mb-4 gap-3">
                            <Link to="/" className="btn btn-outline-custom rounded-circle" style={{ width: '40px', height: '40px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '0' }}>
                                <i className="bi bi-arrow-left"></i>
                            </Link>
                            <h2 className="mb-0 fw-bold text-dark">Update Contact</h2>
                        </div>
                        
                        <div className="glass-card p-4 p-md-5 bg-white border-0 shadow-sm" style={{ borderTop: '4px solid var(--success) !important' }}>
                            <form onSubmit={handleSubmit} className="needs-validation">
                                
                                <div className="row gx-4 mb-4">
                                    <div className="col-md-6 mb-4 mb-md-0">
                                        <label htmlFor="firstName" className="form-label text-secondary fw-semibold">First Name</label>
                                        <input type="text" name="first_name" value={formData.first_name} className="form-control form-control-lg fs-6 bg-light" id="firstName" required onChange={handleChange} />
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="lastName" className="form-label text-secondary fw-semibold">Last Name</label>
                                        <input type="text" name="last_name" value={formData.last_name} className="form-control form-control-lg fs-6 bg-light" id="lastName" required onChange={handleChange} />
                                    </div>
                                </div>

                                <div className="row gx-4 mb-4">
                                    <div className="col-md-6 mb-4 mb-md-0">
                                        <label htmlFor="email" className="form-label text-secondary fw-semibold">Email Address</label>
                                        <input type="email" name="email" value={formData.email} className="form-control form-control-lg fs-6 bg-light" id="email" required onChange={handleChange} />
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="phone" className="form-label text-secondary fw-semibold">Phone Number</label>
                                        <input type="tel" name="phone" value={formData.phone} className="form-control form-control-lg fs-6 bg-light" id="phone" required onChange={handleChange} />
                                    </div>
                                </div>

                                <div className="mb-5">
                                    <label htmlFor="address" className="form-label text-secondary fw-semibold">Physical Address</label>
                                    <textarea className="form-control form-control-lg fs-6 bg-light" name="address" id="address" rows="3" required onChange={handleChange} value={formData.address}></textarea>
                                </div>

                                <div className="d-flex justify-content-end gap-3 pt-3 mt-3 border-top pb-1">
                                    <Link to="/" className="btn btn-outline-custom px-4 d-flex align-items-center">
                                        Cancel
                                    </Link>
                                    <button type="submit" className="btn text-white d-flex align-items-center gap-2 px-5 shadow-sm" style={{ backgroundColor: 'var(--success)', borderColor: 'var(--success)', fontWeight: '500' }}>
                                        Update Now
                                    </button>
                                </div>
                            </form>
                        </div>
                        
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default UpdateContact;
