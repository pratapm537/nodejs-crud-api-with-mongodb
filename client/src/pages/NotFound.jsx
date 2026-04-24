import { Link } from 'react-router-dom';
import Layout from '../components/Layout';

function NotFound() {
    return (
        <Layout>
            <div className="container py-5 text-center d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
                <i className="bi bi-exclamation-triangle text-warning mb-3" style={{ fontSize: '4rem' }}></i>
                <h1 className="fw-bold text-dark display-4 mb-3">404</h1>
                <h3 className="text-secondary mb-4">Page Not Found</h3>
                <p className="text-muted mb-4" style={{ maxWidth: '500px' }}>
                    Oops! The page you are looking for doesn't exist or has been moved. Let's get you back.
                </p>
                <Link to="/" className="btn btn-primary-custom px-4 py-2 d-inline-flex align-items-center gap-2">
                    <i className="bi bi-house"></i> Go Back Home
                </Link>
            </div>
        </Layout>
    );
}

export default NotFound;
