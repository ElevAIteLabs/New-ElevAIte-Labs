import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
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
import useSiteEffects from './hooks/useSiteEffects';

// Wrapper component to apply site effects and scroll to top on route change
function Layout() {
  const location = useLocation();
  useSiteEffects();

  const isAdmin = location.pathname === '/admin';

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
        <Route path="/admin" element={<Admin />} />
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
