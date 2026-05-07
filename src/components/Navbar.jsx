import { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollWidth, setScrollWidth] = useState('0%');
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max <= 0) {
        setScrollWidth('100%');
      } else {
        setScrollWidth(`${(window.scrollY / max) * 100}%`);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]); // update max scroll height on route change

  useEffect(() => {
    // Close sidebar on route change
    setIsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  const items = [
    { label: "Home", path: "/" },
    { label: "About", path: "/about" },
    { label: "Services", path: "/services" },
    { label: "Work", path: "/work" },
    { label: "Products", path: "/products" },
    { label: "Learn", path: "/learn" },
    { label: "Contact", path: "/contact" },
  ];

  return (
    <>
      <div className="scroll-progress">
        <div className="scroll-progress-bar" style={{ width: scrollWidth }}></div>
      </div>
      <nav className={`nav ${scrolled ? 'scrolled' : ''}`} id="main-nav">
        <div className="nav-inner">
          <Link to="/" className="logo">
            <img src="/pictures/logo.png" alt="ElevAIte Labs" style={{ height: '94px', width: '94px', display: 'block', marginLeft: '60px' }} />
          </Link>
          <div className="nav-links">
            {items.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => isActive ? "active" : ""}
                end={item.path === '/'}
              >
                {item.label}
              </NavLink>
            ))}
          </div>
          <Link to="/contact" className="btn btn-primary nav-cta">Book a Call</Link>
          <button
            className="mobile-toggle"
            aria-label="Open menu"
            aria-expanded={isOpen}
            onClick={() => setIsOpen(true)}
          >
            <span></span><span></span><span></span>
          </button>
        </div>
      </nav>

      {/* Sidebar overlay */}
      <div
        className={`nav-sidebar-overlay ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(false)}
      ></div>

      {/* Sidebar panel */}
      <div
        className={`nav-sidebar ${isOpen ? 'open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation"
      >
        <div className="nav-sidebar-head">
          <Link to="/" className="logo">
            <img src="/pictures/logo.png" alt="ElevAIte Labs" style={{ height: '64px', width: 'auto', display: 'block', marginLeft: '20px' }} />
          </Link>
          <button className="nav-sidebar-close" onClick={() => setIsOpen(false)} aria-label="Close menu">✕</button>
        </div>
        <nav className="nav-sidebar-links">
          {items.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => isActive ? "active" : ""}
              end={item.path === '/'}
            >
              {item.label}
              <span className="sidebar-arrow">→</span>
            </NavLink>
          ))}
        </nav>
        <div className="nav-sidebar-footer">
          <Link to="/contact" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>Book a Call</Link>
        </div>
      </div>
    </>
  );
};

export default Navbar;
