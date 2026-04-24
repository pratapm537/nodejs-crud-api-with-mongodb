import Header from './Header';
import Footer from './Footer';

function Layout({ children }) {
  return (
    <div className="d-flex flex-column min-vh-100 w-100">
      <Header />
      <main className="main-content flex-grow-1 w-100">
        {children}
      </main>
      <Footer />
    </div>
  );
}

export default Layout;
