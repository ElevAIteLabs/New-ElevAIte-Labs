import { useState, useEffect } from 'react';

const API_URL = 'https://elevaitelabs.in/api';
// const API_URL = 'http://localhost:5000'; // Used for json-server

const arkinOptions = [
  'Agent-arkin.png',
  'Arkin-Leftside-Pointing-Grey.png',
  'Mobile-arkin.png',
  'animations-arkin.png',
  'arkin.png',
  'rightside-pointing-arkin.png'
];

const schemas = {
  services: { 
    title: 'Services', 
    fields: [
      { name: 'title', type: 'text' }, 
      { name: 'description', type: 'textarea' }, 
      { name: 'eyebrow', type: 'text' }, 
      { name: 'features', type: 'textarea', note: 'Comma separated' }, 
      { 
        name: 'image', 
        type: 'select', 
        options: arkinOptions,
        note: 'Select Arkin character',
        optional: true
      }
    ] 
  },
  work: { 
    title: 'Work', 
    fields: [
      {name: 'title', type: 'text'}, 
      {name: 'description', type: 'textarea'}, 
      {name: 'industry', type: 'text', note: 'e.g. Fintech · Lending'}, 
      {
        name: 'category', 
        type: 'select', 
        options: ['mobile-app', 'web-app', 'ai-automation', 'ai-agent', 'content-creation']
      }, 
      {name: 'image', type: 'file', note: 'Upload project screenshot', optional: true}, 
      {
        name: 'arkin_image', 
        type: 'select', 
        options: arkinOptions,
        note: 'Select Arkin character',
        optional: true
      },
      {name: 'url', type: 'text', note: 'Optional: Link to live project', optional: true}
    ] 
  },
  products: { 
    title: 'Products', 
    fields: [
      { name: 'name', type: 'text' }, 
      { name: 'description', type: 'textarea' }, 
      { name: 'price', type: 'text' }, 
      { name: 'features', type: 'textarea', note: 'Comma separated' }, 
      { 
        name: 'image', 
        type: 'file', 
        note: 'Upload any product image',
        optional: true
      }
    ] 
  },
  learn: { title: 'Learn', fields: [{ name: 'title', type: 'text' }, { name: 'content', type: 'textarea' }, { name: 'author', type: 'text' }, { name: 'date', type: 'date' }] },
  testimonials: { title: 'Testimonials', fields: [{ name: 'name', type: 'text' }, { name: 'company', type: 'text' }, { name: 'text', type: 'textarea' }] }
};

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('admin_auth') === 'true');
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [activeTab, setActiveTab] = useState('services');
  const [data, setData] = useState([]);
  const [contactData, setContactData] = useState({});
  const [formData, setFormData] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;
    if (activeTab === 'contact') {
      fetchContact();
    } else {
      fetchData();
    }
  }, [activeTab, isAuthenticated]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (loginForm.username === 'admin' && loginForm.password === 'admin123') {
      setIsAuthenticated(true);
      localStorage.setItem('admin_auth', 'true');
    } else {
      alert('Invalid credentials');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('admin_auth');
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/${activeTab}.php`);
      const json = await res.json();
      if (Array.isArray(json)) {
        setData(json);
      } else {
        console.error('API Error:', json);
        setData([]);
      }
    } catch (e) {
      console.error(e);
      setData([]);
    }
    setLoading(false);
  };

  const fetchContact = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/contact.php`);
      const json = await res.json();
      setContactData(json);
      setFormData(json);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setSelectedFile(files[0]);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_URL}/upload.php`, {
      method: 'POST',
      body: formData
    });
    const json = await res.json();
    if (json.status === 'success') {
      return json.fileName;
    } else {
      throw new Error(json.message || 'Upload failed');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (activeTab === 'contact') {
        await fetch(`${API_URL}/contact.php`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        alert('Contact updated!');
        fetchContact();
        setLoading(false);
        return;
      }

      let payload = { ...formData };

      // Handle file upload if a new file is selected
      if (selectedFile) {
        const uploadedFileName = await uploadFile(selectedFile);
        payload.image = uploadedFileName;
      }

      if ((activeTab === 'products' || activeTab === 'services') && payload.features && typeof payload.features === 'string') {
        payload.features = payload.features.split(',').map(f => f.trim());
      }

      if (activeTab === 'work' && payload.results && typeof payload.results === 'string') {
        try {
          payload.results = JSON.parse(payload.results);
        } catch (e) {
          alert('Results must be a valid JSON array');
          setLoading(false);
          return;
        }
      }

      if (editingId) {
        const res = await fetch(`${API_URL}/${activeTab}.php?id=${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || 'Failed to update');
        }
      } else {
        const res = await fetch(`${API_URL}/${activeTab}.php`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || 'Failed to create');
        }
      }
      setFormData({});
      setSelectedFile(null);
      setEditingId(null);
      fetchData();
      alert('Saved successfully!');
    } catch (err) {
      console.error(err);
      alert('Error saving data: ' + err.message);
    }
    setLoading(false);
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setSelectedFile(null);
    let editedItem = { ...item };
    if ((activeTab === 'products' || activeTab === 'services') && Array.isArray(editedItem.features)) {
      editedItem.features = editedItem.features.join(', ');
    }
    if (activeTab === 'work' && typeof editedItem.results === 'object') {
      editedItem.results = JSON.stringify(editedItem.results);
    }
    setFormData(editedItem);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      await fetch(`${API_URL}/${activeTab}.php?id=${id}`, { method: 'DELETE' });
      fetchData();
    }
  };

  if (!isAuthenticated) {
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
              <img src="/pictures/logo.png" alt="ElevAIte Labs" style={{ height: '60px' }} />
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
                onChange={(e) => setLoginForm({...loginForm, username: e.target.value})} 
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
                onFocus={(e) => e.target.style.borderColor = '#1e88e5'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#cbd5e1', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Password</label>
              <input 
                type="password" 
                value={loginForm.password} 
                onChange={(e) => setLoginForm({...loginForm, password: e.target.value})} 
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
                onFocus={(e) => e.target.style.borderColor = '#1e88e5'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
            </div>
            <button 
              type="submit" 
              style={{ 
                marginTop: '8px',
                background: '#1e88e5', 
                color: 'white', 
                border: 'none', 
                padding: '16px', 
                borderRadius: '12px', 
                fontSize: '16px', 
                fontWeight: '700', 
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(30,136,229,0.4)',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => e.target.style.background = '#1976d2'}
              onMouseOut={(e) => e.target.style.background = '#1e88e5'}
            >
              Authorize Access
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
  }

  return (
    <div className="admin-container" style={{ padding: '120px 5%', minHeight: '100vh', background: '#f8fafc', color: '#0f172a' }}>
      <style>{`
        .admin-layout { display: flex; gap: 40px; margin-top: 40px; }
        .admin-sidebar { width: 250px; background: white; padding: 20px; border-radius: 12px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); height: fit-content; }
        .admin-sidebar button { display: block; width: 100%; text-align: left; padding: 12px 16px; margin-bottom: 8px; border: none; background: transparent; border-radius: 8px; cursor: pointer; font-size: 16px; transition: all 0.2s; color: #64748b; font-weight: 500; }
        .admin-sidebar button.active { background: #0f172a; color: white; }
        .admin-sidebar button:hover:not(.active) { background: #f1f5f9; }
        .admin-content { flex: 1; background: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); }
        .admin-title { font-size: 32px; font-weight: 700; margin-bottom: 30px; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; }
        .admin-form { display: grid; gap: 20px; margin-bottom: 40px; background: #f8fafc; padding: 24px; border-radius: 12px; border: 1px solid #e2e8f0; }
        .form-group { display: flex; flex-direction: column; gap: 8px; }
        .form-group label { font-weight: 600; font-size: 14px; color: #475569; text-transform: uppercase; letter-spacing: 0.05em; }
        .form-group input, .form-group textarea { padding: 12px 16px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 16px; font-family: inherit; transition: border-color 0.2s; }
        .form-group input:focus, .form-group textarea:focus { outline: none; border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); }
        .form-group textarea { min-height: 100px; resize: vertical; }
        .admin-btn { background: #0f172a; color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 16px; transition: background 0.2s; }
        .admin-btn:hover { background: #1e293b; }
        .admin-btn-outline { background: white; color: #0f172a; border: 1px solid #cbd5e1; padding: 12px 24px; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 16px; transition: all 0.2s; }
        .admin-btn-outline:hover { background: #f1f5f9; border-color: #94a3b8; }
        .admin-btn-danger { background: #ef4444; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-weight: 500; font-size: 14px; }
        .admin-btn-danger:hover { background: #dc2626; }
        .admin-btn-edit { background: #3b82f6; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-weight: 500; font-size: 14px; margin-right: 8px; }
        .admin-btn-edit:hover { background: #2563eb; }
        .admin-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        .admin-table th, .admin-table td { padding: 16px; text-align: left; border-bottom: 1px solid #e2e8f0; }
        .admin-table th { font-weight: 600; color: #475569; background: #f8fafc; }
        .admin-table tr:hover td { background: #f8fafc; }
      `}</style>

      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '48px', fontWeight: '800', letterSpacing: '-0.02em', marginBottom: '10px' }}>Admin Dashboard</h1>
        <p style={{ color: '#64748b', fontSize: '18px' }}>Manage your website content seamlessly.</p>
      </div>

      <div className="admin-layout">
        <div className="admin-sidebar">
          {Object.keys(schemas).map(key => (
            <button key={key} className={activeTab === key ? 'active' : ''} onClick={() => { setActiveTab(key); setFormData({}); setEditingId(null); }}>
              {schemas[key].title}
            </button>
          ))}
          <button className={activeTab === 'contact' ? 'active' : ''} onClick={() => { setActiveTab('contact'); setFormData({}); setEditingId(null); }}>
            Contact Info
          </button>
          <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '20px 0' }} />
          <button onClick={handleLogout} style={{ color: '#ef4444' }}>
            Logout
          </button>
        </div>

        <div className="admin-content">
          <h2 className="admin-title">{activeTab === 'contact' ? 'Contact Info' : schemas[activeTab].title}</h2>

          <form className="admin-form" onSubmit={handleSubmit}>
            {activeTab === 'contact' ? (
              <>
                <div className="form-group">
                  <label>Email</label>
                  <input type="text" name="email" value={formData.email || ''} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input type="text" name="phone" value={formData.phone || ''} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label>Address</label>
                  <input type="text" name="address" value={formData.address || ''} onChange={handleInputChange} required />
                </div>
              </>
            ) : (
              schemas[activeTab].fields.map(field => (
                <div className="form-group" key={field.name}>
                  <label>{field.name} {field.note && <span style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'none' }}>({field.note})</span>}</label>
                  {field.type === 'textarea' ? (
                    <textarea name={field.name} value={formData[field.name] || ''} onChange={handleInputChange} required={!field.optional} />
                  ) : field.type === 'select' ? (
                    <select name={field.name} value={formData[field.name] || ''} onChange={handleInputChange} required={!field.optional} style={{ padding: '12px 16px', border: '1px solid #cbd5e1', borderRadius: '8px', width: '100%' }}>
                      <option value="">Select {field.name}</option>
                      {field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  ) : (
                    <input type={field.type} name={field.name} value={field.type === 'file' ? undefined : (formData[field.name] || '')} onChange={handleInputChange} required={field.type !== 'file' && !field.optional} />
                  )}
                </div>
              ))
            )}

            <div style={{ display: 'flex', gap: '16px', marginTop: '10px' }}>
              <button type="submit" className="admin-btn">
                {activeTab === 'contact' ? 'Save Contact Info' : (editingId ? 'Update Item' : 'Add New Item')}
              </button>
              {editingId && (
                <button type="button" className="admin-btn-outline" onClick={() => { setEditingId(null); setFormData({}); }}>
                  Cancel Edit
                </button>
              )}
            </div>
          </form>

          {activeTab !== 'contact' && !loading && (
            <div style={{ overflowX: 'auto' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    {schemas[activeTab].fields.map(f => <th key={f.name}>{f.name.charAt(0).toUpperCase() + f.name.slice(1)}</th>)}
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map(item => (
                    <tr key={item.id}>
                      {schemas[activeTab].fields.map(f => (
                        <td key={f.name}>
                          {Array.isArray(item[f.name]) ? item[f.name].join(', ') : (item[f.name]?.length > 50 ? item[f.name].substring(0, 50) + '...' : item[f.name])}
                        </td>
                      ))}
                      <td style={{ minWidth: '150px' }}>
                        <button className="admin-btn-edit" onClick={() => handleEdit(item)}>Edit</button>
                        <button className="admin-btn-danger" onClick={() => handleDelete(item.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                  {data.length === 0 && (
                    <tr><td colSpan={schemas[activeTab].fields.length + 1} style={{ textAlign: 'center', color: '#94a3b8', padding: '30px' }}>No items found. Add one above!</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
