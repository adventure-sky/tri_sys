import { useState } from 'react';
import { login } from '../services/api';

export default function Login({ onLogin }) {
  const [userid, setUserid] = useState('');
  const [pwd, setPwd] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await login(userid, pwd);
      onLogin(res.data.user);
    } catch (err) {
      setError(err.response?.data?.message || '登入失敗，請確認帳號密碼');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        <h2 style={s.title}>三層式資料維護系統</h2>
        <p style={s.subtitle}>請登入以繼續</p>
        <form onSubmit={handleSubmit}>
          <div style={s.field}>
            <label style={s.label}>用戶代碼</label>
            <input
              value={userid}
              onChange={e => setUserid(e.target.value)}
              required
              style={s.input}
              autoFocus
            />
          </div>
          <div style={s.field}>
            <label style={s.label}>密碼</label>
            <input
              type="password"
              value={pwd}
              onChange={e => setPwd(e.target.value)}
              required
              style={s.input}
            />
          </div>
          {error && <div style={s.error}>{error}</div>}
          <button type="submit" style={s.btn} disabled={loading}>
            {loading ? '登入中...' : '登入'}
          </button>
        </form>
      </div>
    </div>
  );
}

const s = {
  page: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f0f2f5' },
  card: { background: '#fff', padding: '40px', borderRadius: '8px', boxShadow: '0 2px 12px rgba(0,0,0,0.12)', width: '340px' },
  title: { textAlign: 'center', marginBottom: '8px', color: '#1890ff', fontSize: '20px' },
  subtitle: { textAlign: 'center', marginBottom: '24px', color: '#888', fontSize: '14px' },
  field: { marginBottom: '16px' },
  label: { display: 'block', marginBottom: '4px', fontWeight: '500', fontSize: '14px' },
  input: { width: '100%', padding: '8px 12px', border: '1px solid #d9d9d9', borderRadius: '4px', fontSize: '14px', outline: 'none' },
  error: { color: '#ff4d4f', marginBottom: '12px', fontSize: '13px' },
  btn: { width: '100%', padding: '10px', background: '#1890ff', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '16px', fontWeight: '500' },
};
