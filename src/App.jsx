import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Work from './pages/Work';
import Products from './pages/Products';
import Learn from './pages/Learn';
import Contact from './pages/Contact';
import BlogAutomation from './pages/BlogAutomation';
import BlogKredoo from './pages/BlogKredoo';
import BlogWhatsapp from './pages/BlogWhatsapp';
import Admin from './pages/Admin';
import AdminLogin from './pages/AdminLogin';
import useSiteEffects from './hooks/useSiteEffects';

// Ask the server whether the session cookie is valid. A localStorage flag
// only hides the UI — the API enforces access on every request regardless.
const ProtectedRoute = ({ children }) => {
  const [state, setState] = useState('checking');

  useEffect(() => {
    let cancelled = false;

    if (import.meta.env.DEV) {
      // No PHP in local dev; fall back to the dev-only login flag.
      setState(localStorage.getItem('admin_auth') === 'true' ? 'allowed' : 'denied');
      return;
    }

    fetch(`${import.meta.env.VITE_API_URL}/session.php`, { credentials: 'include' })
      .then((r) => r.json())
      .then((d) => !cancelled && setState(d.authenticated ? 'allowed' : 'denied'))
      .catch(() => !cancelled && setState('denied'));

    return () => { cancelled = true; };
  }, []);

  if (state === 'checking') {
    return (
      <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#0f172a', color: '#94a3b8' }}>
        Verifying session…
      </div>
    );
  }

  return state === 'allowed' ? children : <Navigate to="/admin/login" replace />;
};

// Wrapper component to apply site effects and scroll to top on route change
function Layout() {
  const location = useLocation();
  useSiteEffects();

  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <>
      {!isAdmin && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/work" element={<Work />} />
        <Route path="/products" element={<Products />} />
        <Route path="/learn" element={<Learn />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/blog-automation" element={<BlogAutomation />} />
        <Route path="/blog-kredoo" element={<BlogKredoo />} />
        <Route path="/blog-whatsapp" element={<BlogWhatsapp />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
      </Routes>
      {!isAdmin && <Footer />}
    </>
  );
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;
