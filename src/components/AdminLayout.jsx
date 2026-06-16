import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const AdminLayout = ({ children, activeTab, onTabChange, schemas, handleLogout }) => {
  return (
    <div className="admin-container" style={{ padding: '80px 5% 120px', minHeight: '100vh', background: '#f8fafc', color: '#0f172a', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <style>{`
        .admin-layout { display: flex; gap: 32px; margin-top: 48px; max-width: 1400px; margin-left: auto; margin-right: auto; }
        .admin-sidebar { width: 280px; background: white; padding: 24px; border-radius: 20px; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05); height: fit-content; border: 1px solid #e2e8f0; }
        .admin-sidebar button { display: block; width: 100%; text-align: left; padding: 14px 18px; margin-bottom: 8px; border: none; background: transparent; border-radius: 12px; cursor: pointer; font-size: 15px; transition: all 0.25s; color: #64748b; font-weight: 600; }
        .admin-sidebar button.active { background: #0f172a; color: white; box-shadow: 0 4px 12px rgba(15, 23, 42, 0.2); }
        .admin-sidebar button:hover:not(.active) { background: #f1f5f9; color: #0f172a; transform: translateX(4px); }
        .admin-content { flex: 1; background: white; padding: 48px; border-radius: 24px; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; min-width: 0; }
        .admin-title { font-size: 32px; font-weight: 800; margin-bottom: 32px; border-bottom: 2px solid #f1f5f9; padding-bottom: 16px; color: #0f172a; letter-spacing: -0.02em; }
        .admin-form { display: grid; gap: 24px; margin-bottom: 48px; background: #f8fafc; padding: 32px; border-radius: 20px; border: 1px solid #e2e8f0; }
        .form-group { display: flex; flex-direction: column; gap: 10px; }
        .form-group label { font-weight: 700; font-size: 13px; color: #475569; text-transform: uppercase; letter-spacing: 0.05em; }
        .form-group input, .form-group textarea, .form-group select { padding: 14px 18px; border: 1px solid #cbd5e1; border-radius: 12px; font-size: 16px; font-family: inherit; transition: all 0.2s; background: white; }
        .form-group input:focus, .form-group textarea:focus, .form-group select:focus { outline: none; border-color: #1e88e5; box-shadow: 0 0 0 4px rgba(30, 136, 229, 0.1); }
        .form-group textarea { min-height: 120px; resize: vertical; }
        .admin-btn { background: #0f172a; color: white; border: none; padding: 14px 28px; border-radius: 12px; cursor: pointer; font-weight: 700; font-size: 15px; transition: all 0.2s; box-shadow: 0 4px 12px rgba(15, 23, 42, 0.15); }
        .admin-btn:hover { background: #1e293b; transform: translateY(-1px); box-shadow: 0 6px 16px rgba(15, 23, 42, 0.2); }
        .admin-btn-outline { background: white; color: #0f172a; border: 1px solid #cbd5e1; padding: 14px 28px; border-radius: 12px; cursor: pointer; font-weight: 700; font-size: 15px; transition: all 0.2s; }
        .admin-btn-outline:hover { background: #f8fafc; border-color: #94a3b8; }
        .admin-btn-danger { background: #fee2e2; color: #dc2626; border: 1px solid #fecaca; padding: 8px 14px; border-radius: 10px; cursor: pointer; font-weight: 600; font-size: 13px; transition: all 0.2s; }
        .admin-btn-danger:hover { background: #fecaca; transform: scale(1.02); }
        .admin-btn-edit { background: #dbeafe; color: #2563eb; border: 1px solid #bfdbfe; padding: 8px 14px; border-radius: 10px; cursor: pointer; font-weight: 600; font-size: 13px; transition: all 0.2s; margin-right: 8px; }
        .admin-btn-edit:hover { background: #bfdbfe; transform: scale(1.02); }
        .admin-table { width: 100%; border-collapse: separate; border-spacing: 0; margin-top: 24px; }
        .admin-table th { padding: 18px 20px; text-align: left; font-weight: 700; color: #475569; background: #f8fafc; border-bottom: 2px solid #e2e8f0; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em; }
        .admin-table td { padding: 18px 20px; text-align: left; border-bottom: 1px solid #f1f5f9; font-size: 15px; color: #334155; }
        .admin-table tr:last-child td { border-bottom: none; }
        .admin-table tr:hover td { background: #f8fafc; }
        
        @media (max-width: 1024px) {
          .admin-layout { flex-direction: column; }
          .admin-sidebar { width: 100%; }
        }
      `}</style>

      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <div style={{ 
          width: '64px', 
          height: '64px', 
          background: 'white', 
          borderRadius: '16px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          margin: '0 auto 20px',
          boxShadow: '0 8px 20px rgba(0,0,0,0.06)',
          border: '1px solid #f1f5f9'
        }}>
          <img src="/favicon.png" alt="Logo" style={{ height: '40px' }} />
        </div>
        <h1 style={{ fontSize: '42px', fontWeight: '900', letterSpacing: '-0.03em', color: '#0f172a', marginBottom: '8px' }}>Admin Dashboard</h1>
        <p style={{ color: '#64748b', fontSize: '18px', fontWeight: '500' }}>Manage your website content with precision.</p>
      </div>

      <div className="admin-layout">
        <aside className="admin-sidebar">
          <div style={{ fontSize: '11px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px', paddingLeft: '12px' }}>Content Management</div>
          {Object.keys(schemas).map(key => (
            <button 
              key={key} 
              className={activeTab === key ? 'active' : ''} 
              onClick={() => onTabChange(key)}
            >
              {schemas[key].title}
            </button>
          ))}
          <button 
            className={activeTab === 'contact' ? 'active' : ''} 
            onClick={() => onTabChange('contact')}
          >
            Contact Settings
          </button>
          
          <div style={{ height: '1px', background: '#f1f5f9', margin: '20px 0' }}></div>
          
          <button onClick={handleLogout} style={{ color: '#ef4444' }}>
            <span style={{ marginRight: '8px' }}>←</span> Sign Out
          </button>
        </aside>

        <main className="admin-content">
          {children}
        </main>
      </div>
      
      <div style={{ marginTop: '64px', textAlign: 'center', color: '#94a3b8', fontSize: '14px', fontWeight: '500' }}>
        ElevAIte Labs Admin Terminal • v2.0.0 • © 2026
      </div>
    </div>
  );
};

export default AdminLayout;
