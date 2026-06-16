import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';

const IS_DEV = import.meta.env.DEV;
const API_URL = import.meta.env.VITE_API_URL;
const DEV_API = 'http://localhost:5000';

const arkinOptions = [
  'Agent-arkin.png',
  'Arkin-Leftside-Pointing-Grey.png',
  'Mobile-arkin.png',
  'animations-arkin.png',
  'arkin.png',
  'rightside-pointing-arkin.png',
  'arkincontentcreation.png',
  'arkinleadgeneration.png',
  'strategy.png',
  'contactarkine.png',
  'whatsapparkine.png',
  'productsarkine.png',
];

const schemas = {
  services: {
    title: 'Services',
    fields: [
      { name: 'title', type: 'text' },
      { name: 'description', type: 'textarea' },
      { name: 'eyebrow', type: 'text' },
      { name: 'features', type: 'textarea', note: 'Comma separated' },
      { name: 'image', type: 'select', options: arkinOptions, note: 'Select Arkin character', optional: true }
    ]
  },
  work: {
    title: 'Work',
    fields: [
      { name: 'title', type: 'text' },
      { name: 'description', type: 'textarea' },
      { name: 'industry', type: 'text', note: 'e.g. Fintech · Lending' },
      { name: 'category', type: 'select', options: ['mobile-app', 'web-app', 'ai-automation', 'ai-agent', 'content-creation'] },
      { name: 'image', type: 'file', note: 'Upload project screenshot', optional: true },
      { name: 'arkin_image', type: 'select', options: arkinOptions, note: 'Select Arkin character', optional: true },
      { name: 'url', type: 'text', note: 'Optional: Link to live project', optional: true }
    ]
  },
  products: {
    title: 'Products',
    fields: [
      { name: 'name', type: 'text' },
      { name: 'description', type: 'textarea' },
      { name: 'price', type: 'text' },
      { name: 'features', type: 'textarea', note: 'Comma separated' },
      { name: 'image', type: 'file', note: 'Upload any product image', optional: true }
    ]
  },
  learn: {
    title: 'Learn',
    fields: [
      { name: 'title', type: 'text' },
      { name: 'content', type: 'textarea' },
      { name: 'author', type: 'text' },
      { name: 'date', type: 'date' }
    ]
  },
  testimonials: {
    title: 'Testimonials',
    fields: [
      { name: 'name', type: 'text' },
      { name: 'company', type: 'text' },
      { name: 'text', type: 'textarea' }
    ]
  }
};

export default function Admin() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('services');
  const [data, setData] = useState([]);
  const [contactData, setContactData] = useState({});
  const [formData, setFormData] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('admin_auth') !== 'true') {
      navigate('/admin/login');
    }
  }, []);

  useEffect(() => {
    if (localStorage.getItem('admin_auth') !== 'true') return;
    if (activeTab === 'contact') {
      fetchContact();
    } else {
      fetchData();
    }
  }, [activeTab]);

  const handleLogout = () => {
    localStorage.removeItem('admin_auth');
    navigate('/admin/login');
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setFormData({});
    setEditingId(null);
  };

  const apiUrl = (path) => IS_DEV
    ? `${DEV_API}/${path}`
    : `${API_URL}/${path}.php`;

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(apiUrl(activeTab));
      const json = await res.json();
      setData(Array.isArray(json) ? json : []);
    } catch (e) {
      console.error(e);
      setData([]);
    }
    setLoading(false);
  };

  const fetchContact = async () => {
    setLoading(true);
    try {
      const res = await fetch(apiUrl('contact'));
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
    if (IS_DEV) return file.name;
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch(`${API_URL}/upload.php`, { method: 'POST', body: fd });
    const json = await res.json();
    if (json.status === 'success') return json.fileName;
    throw new Error(json.message || 'Upload failed');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (activeTab === 'contact') {
        await fetch(IS_DEV ? `${DEV_API}/contact/1` : `${API_URL}/contact.php`, {
          method: IS_DEV ? 'PATCH' : 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        alert('Contact updated!');
        fetchContact();
        setLoading(false);
        return;
      }

      let payload = { ...formData };

      if (selectedFile) {
        payload.image = await uploadFile(selectedFile);
      }

      if ((activeTab === 'products' || activeTab === 'services') && payload.features && typeof payload.features === 'string') {
        payload.features = payload.features.split(',').map(f => f.trim());
      }

      if (activeTab === 'work' && payload.results && typeof payload.results === 'string') {
        try {
          payload.results = JSON.parse(payload.results);
        } catch {
          alert('Results must be a valid JSON array');
          setLoading(false);
          return;
        }
      }

      const url = IS_DEV
        ? (editingId ? `${DEV_API}/${activeTab}/${editingId}` : `${DEV_API}/${activeTab}`)
        : (editingId ? `${API_URL}/${activeTab}.php?id=${editingId}` : `${API_URL}/${activeTab}.php`);
      const method = editingId ? (IS_DEV ? 'PATCH' : 'PUT') : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to save');
      }

      setFormData({});
      setSelectedFile(null);
      setEditingId(null);
      fetchData();
      alert('Saved successfully!');
    } catch (err) {
      console.error(err);
      alert('Error: ' + err.message);
    }
    setLoading(false);
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setSelectedFile(null);
    let edited = { ...item };
    if ((activeTab === 'products' || activeTab === 'services') && Array.isArray(edited.features)) {
      edited.features = edited.features.join(', ');
    }
    if (activeTab === 'work' && typeof edited.results === 'object') {
      edited.results = JSON.stringify(edited.results);
    }
    setFormData(edited);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    await fetch(IS_DEV ? `${DEV_API}/${activeTab}/${id}` : `${API_URL}/${activeTab}.php?id=${id}`, { method: 'DELETE' });
    fetchData();
  };

  return (
    <AdminLayout
      activeTab={activeTab}
      onTabChange={handleTabChange}
      schemas={schemas}
      handleLogout={handleLogout}
    >
      <h2 className="admin-title">{activeTab === 'contact' ? 'Contact Settings' : schemas[activeTab]?.title}</h2>

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
          schemas[activeTab]?.fields.map(field => (
            <div className="form-group" key={field.name}>
              <label>
                {field.name}
                {field.note && <span style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'none', fontWeight: 400, marginLeft: '6px' }}>({field.note})</span>}
              </label>
              {field.type === 'textarea' ? (
                <textarea name={field.name} value={formData[field.name] || ''} onChange={handleInputChange} required={!field.optional} />
              ) : field.type === 'select' ? (
                <select name={field.name} value={formData[field.name] || ''} onChange={handleInputChange} required={!field.optional} style={{ padding: '14px 18px', border: '1px solid #cbd5e1', borderRadius: '12px', width: '100%', fontSize: '16px' }}>
                  <option value="">Select {field.name}</option>
                  {field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              ) : (
                <input type={field.type} name={field.name} value={field.type === 'file' ? undefined : (formData[field.name] || '')} onChange={handleInputChange} required={field.type !== 'file' && !field.optional} />
              )}
            </div>
          ))
        )}

        <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
          <button type="submit" className="admin-btn" disabled={loading}>
            {loading ? 'Saving...' : activeTab === 'contact' ? 'Save Contact Info' : editingId ? 'Update Item' : 'Add New Item'}
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
                {schemas[activeTab]?.fields.map(f => (
                  <th key={f.name}>{f.name.charAt(0).toUpperCase() + f.name.slice(1)}</th>
                ))}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map(item => (
                <tr key={item.id}>
                  {schemas[activeTab]?.fields.map(f => (
                    <td key={f.name}>
                      {Array.isArray(item[f.name])
                        ? item[f.name].join(', ')
                        : String(item[f.name] ?? '').length > 50
                          ? String(item[f.name]).substring(0, 50) + '...'
                          : item[f.name]}
                    </td>
                  ))}
                  <td style={{ minWidth: '160px' }}>
                    <button className="admin-btn-edit" onClick={() => handleEdit(item)}>Edit</button>
                    <button className="admin-btn-danger" onClick={() => handleDelete(item.id)}>Delete</button>
                  </td>
                </tr>
              ))}
              {data.length === 0 && (
                <tr>
                  <td colSpan={schemas[activeTab]?.fields.length + 1} style={{ textAlign: 'center', color: '#94a3b8', padding: '40px' }}>
                    No items found. Add one above!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {loading && (
        <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>Loading...</div>
      )}
    </AdminLayout>
  );
}
