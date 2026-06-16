import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/login.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm)
      });

      if (response.ok) {
        const data = await response.json();
        if (data.status === 'success') {
          localStorage.setItem('admin_auth', 'true');
          navigate('/admin');
        } else {
          alert(data.message || 'Invalid credentials');
        }
      } else if (response.status === 404 && import.meta.env.DEV) {
        // Local dev fallback — PHP not available locally
        if (loginForm.username === 'admin' && loginForm.password === 'admin123') {
          localStorage.setItem('admin_auth', 'true');
          navigate('/admin');
        } else {
          alert('Invalid credentials');
        }
      } else {
        alert('Invalid credentials');
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        // Network error in dev — use fallback
        if (loginForm.username === 'admin' && loginForm.password === 'admin123') {
          localStorage.setItem('admin_auth', 'true');
          navigate('/admin');
        } else {
          alert('Invalid credentials');
        }
      } else {
        console.error('Login error:', error);
        alert('An error occurred during login. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: '#0f172a',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      {/* Background Decorative Elements */}
      <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '40%', height: '40%', background: 'radial-gradient(circle, rgba(30,136,229,0.15) 0%, transparent 70%)', borderRadius: '50%' }}></div>
      <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '50%', height: '50%', background: 'radial-gradient(circle, rgba(30,136,229,0.1) 0%, transparent 70%)', borderRadius: '50%' }}></div>

      <div style={{
        background: 'rgba(30, 41, 59, 0.7)',
        backdropFilter: 'blur(16px)',
        padding: '48px',
        borderRadius: '24px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
        width: '100%',
        maxWidth: '440px',
        zIndex: 10,
        animation: 'slideUp 0.6s cubic-bezier(0.22, 1, 0.36, 1)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            width: '80px',
            height: '80px',
            background: '#fff',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
            boxShadow: '0 0 20px rgba(30,136,229,0.3)'
          }}>
            <img src="/favicon.png" alt="ElevAIte Labs" style={{ height: '50px', width: '100px' }} />
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#fff', letterSpacing: '-0.02em', marginBottom: '8px' }}>Welcome Back</h1>
          <p style={{ color: '#94a3b8', fontSize: '15px' }}>Enter your credentials to access the lab.</p>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'grid', gap: '24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '13px', fontWeight: '600', color: '#cbd5e1', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Username</label>
            <input
              type="text"
              value={loginForm.username}
              onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
              required
              placeholder="admin"
              style={{
                padding: '14px 18px',
                background: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                color: '#fff',
                fontSize: '16px',
                outline: 'none',
                transition: 'all 0.2s'
              }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '13px', fontWeight: '600', color: '#cbd5e1', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Password</label>
            <input
              type="password"
              value={loginForm.password}
              onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
              required
              placeholder="••••••••"
              style={{
                padding: '14px 18px',
                background: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                color: '#fff',
                fontSize: '16px',
                outline: 'none',
                transition: 'all 0.2s'
              }}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: '8px',
              background: '#1e88e5',
              color: 'white',
              border: 'none',
              padding: '16px',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '700',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              boxShadow: '0 4px 14px rgba(30,136,229,0.4)',
              transition: 'all 0.2s'
            }}
          >
            {loading ? 'Authenticating...' : 'Authorize Access'}
          </button>
        </form>

        <div style={{ marginTop: '32px', textAlign: 'center' }}>
          <p style={{ color: '#64748b', fontSize: '13px' }}>© 2026 ElevAIte Labs • Secure Terminal</p>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default AdminLogin;
