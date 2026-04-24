import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import api from '../api';

function AddContact() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        address: ''
    });

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/', formData);
            navigate('/');
        } catch (error) {
            console.error("Error creating contact:", error);
            alert("Failed to create contact.");
        }
    };

    return (
        <Layout>
            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-lg-7 col-md-9">
                        
                        <div className="d-flex align-items-center mb-4 gap-3">
                            <Link to="/" className="btn btn-outline-custom rounded-circle" style={{ width: '40px', height: '40px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '0' }}>
                                <i className="bi bi-arrow-left"></i>
                            </Link>
                            <h2 className="mb-0 fw-bold text-dark">Add New Contact</h2>
                        </div>
                        
                        <div className="glass-card p-4 p-md-5 bg-white border-0 shadow-sm">
                            <form onSubmit={handleSubmit} className="needs-validation">
                                
                                <div className="row gx-4 mb-4">
                                    <div className="col-md-6 mb-4 mb-md-0">
                                        <label htmlFor="firstName" className="form-label text-secondary fw-semibold">First Name</label>
                                        <input type="text" name="first_name" className="form-control form-control-lg fs-6 bg-light" id="firstName" placeholder="e.g. Jane" required onChange={handleChange} value={formData.first_name} />
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="lastName" className="form-label text-secondary fw-semibold">Last Name</label>
                                        <input type="text" name="last_name" className="form-control form-control-lg fs-6 bg-light" id="lastName" placeholder="e.g. Doe" required onChange={handleChange} value={formData.last_name} />
                                    </div>
                                </div>

                                <div className="row gx-4 mb-4">
                                    <div className="col-md-6 mb-4 mb-md-0">
                                        <label htmlFor="email" className="form-label text-secondary fw-semibold">Email Address</label>
                                        <input type="email" name="email" className="form-control form-control-lg fs-6 bg-light" id="email" placeholder="jane.doe@example.com" required onChange={handleChange} value={formData.email} />
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="phone" className="form-label text-secondary fw-semibold">Phone Number</label>
                                        <input type="tel" name="phone" className="form-control form-control-lg fs-6 bg-light" id="phone" placeholder="+1 (555) 000-0000" required onChange={handleChange} value={formData.phone} />
                                    </div>
                                </div>

                                <div className="mb-5">
                                    <label htmlFor="address" className="form-label text-secondary fw-semibold">Physical Address</label>
                                    <textarea className="form-control form-control-lg fs-6 bg-light" name="address" id="address" rows="3" placeholder="Enter complete address..." required onChange={handleChange} value={formData.address}></textarea>
                                </div>

                                <div className="d-flex justify-content-end gap-3 pt-3 mt-3 border-top pb-1">
                                    <Link to="/" className="btn btn-outline-custom px-4 d-flex align-items-center">
                                        Cancel
                                    </Link>
                                    <button type="submit" className="btn btn-primary-custom d-flex align-items-center gap-2 px-5 shadow-sm">
                                        Save Contact
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

export default AddContact;
