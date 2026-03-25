import { useState, useEffect } from 'react';

export default function DataMaint({ title, api, fields, keyField }) {
  const [records, setRecords] = useState([]);
  const [form, setForm] = useState({});
  const [editKey, setEditKey] = useState(null);
  const [search, setSearch] = useState('');
  const [msg, setMsg] = useState({ text: '', type: '' });
  const [mode, setMode] = useState('list');
  const [loading, setLoading] = useState(false);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const res = await api.getAll();
      setRecords(res.data);
    } catch (err) {
      showMsg(err.response?.data?.error || '讀取失敗', 'error');
    }
  };

  const showMsg = (text, type = 'success') => {
    setMsg({ text, type });
    setTimeout(() => setMsg({ text: '', type: '' }), 3000);
  };

  const handleNew = () => {
    setForm({});
    setEditKey(null);
    setMode('edit');
    setMsg({ text: '', type: '' });
  };

  const handleEdit = (rec) => {
    setForm({ ...rec });
    setEditKey(rec[keyField]);
    setMode('edit');
    setMsg({ text: '', type: '' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm(`確定要刪除此筆資料？`)) return;
    try {
      await api.remove(id);
      showMsg('刪除成功');
      loadData();
    } catch (err) {
      showMsg(err.response?.data?.error || '刪除失敗', 'error');
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      if (editKey) {
        await api.update(editKey, form);
        showMsg('修改成功');
      } else {
        await api.create(form);
        showMsg('新增成功');
      }
      setMode('list');
      loadData();
    } catch (err) {
      showMsg(err.response?.data?.error || '儲存失敗', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filtered = records.filter(rec =>
    fields.some(f => (rec[f.name] ?? '').toString().toLowerCase().includes(search.toLowerCase()))
  );

  if (mode === 'edit') {
    return (
      <div style={s.card}>
        <h3 style={s.cardTitle}>{editKey ? '修改' : '新增'} {title}</h3>
        {fields.map(f => (
          <div key={f.name} style={s.field}>
            <label style={s.label}>{f.caption}</label>
            <input
              value={form[f.name] ?? ''}
              onChange={e => setForm({ ...form, [f.name]: e.target.value })}
              disabled={f.name === keyField && !!editKey}
              style={{ ...s.input, background: f.name === keyField && editKey ? '#f5f5f5' : '#fff' }}
            />
          </div>
        ))}
        {msg.text && <div style={{ ...s.msg, color: msg.type === 'error' ? '#ff4d4f' : '#52c41a' }}>{msg.text}</div>}
        <div style={s.btnRow}>
          <button style={s.saveBtn} onClick={handleSave} disabled={loading}>
            {loading ? '儲存中...' : '儲存'}
          </button>
          <button style={s.cancelBtn} onClick={() => setMode('list')}>取消</button>
        </div>
      </div>
    );
  }

  return (
    <div style={s.card}>
      <h3 style={s.cardTitle}>{title}</h3>
      <div style={s.toolbar}>
        <input
          placeholder="搜尋..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={s.searchInput}
        />
        <button style={s.newBtn} onClick={handleNew}>+ 新增</button>
      </div>
      {msg.text && <div style={{ ...s.msg, color: msg.type === 'error' ? '#ff4d4f' : '#52c41a' }}>{msg.text}</div>}
      <table style={s.table}>
        <thead>
          <tr style={s.thead}>
            {fields.map(f => <th key={f.name} style={s.th}>{f.caption}</th>)}
            <th style={s.th}>操作</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 ? (
            <tr><td colSpan={fields.length + 1} style={s.empty}>無資料</td></tr>
          ) : (
            filtered.map((rec, i) => (
              <tr key={rec[keyField]} style={{ background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                {fields.map(f => <td key={f.name} style={s.td}>{rec[f.name]}</td>)}
                <td style={s.td}>
                  <button style={s.editBtn} onClick={() => handleEdit(rec)}>修改</button>
                  <button style={s.delBtn} onClick={() => handleDelete(rec[keyField])}>刪除</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <div style={s.footer}>共 {filtered.length} 筆</div>
    </div>
  );
}

const s = {
  card: { background: '#fff', borderRadius: '8px', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.1)' },
  cardTitle: { fontSize: '18px', fontWeight: 'bold', marginBottom: '20px', color: '#333' },
  toolbar: { display: 'flex', gap: '12px', marginBottom: '16px' },
  searchInput: { padding: '6px 12px', border: '1px solid #d9d9d9', borderRadius: '4px', fontSize: '14px', width: '240px' },
  newBtn: { padding: '6px 16px', background: '#1890ff', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '14px' },
  msg: { marginBottom: '12px', fontSize: '14px', fontWeight: '500' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '14px' },
  thead: { background: '#fafafa' },
  th: { padding: '10px 12px', textAlign: 'left', border: '1px solid #f0f0f0', fontWeight: '600', color: '#555' },
  td: { padding: '10px 12px', border: '1px solid #f0f0f0' },
  empty: { padding: '24px', textAlign: 'center', color: '#999', border: '1px solid #f0f0f0' },
  footer: { marginTop: '12px', fontSize: '13px', color: '#888', textAlign: 'right' },
  editBtn: { padding: '2px 10px', marginRight: '6px', background: '#1890ff', color: '#fff', border: 'none', borderRadius: '3px', fontSize: '13px' },
  delBtn: { padding: '2px 10px', background: '#ff4d4f', color: '#fff', border: 'none', borderRadius: '3px', fontSize: '13px' },
  field: { marginBottom: '16px' },
  label: { display: 'block', marginBottom: '4px', fontWeight: '500', fontSize: '14px' },
  input: { width: '100%', maxWidth: '400px', padding: '8px 12px', border: '1px solid #d9d9d9', borderRadius: '4px', fontSize: '14px' },
  btnRow: { display: 'flex', gap: '12px', marginTop: '8px' },
  saveBtn: { padding: '8px 24px', background: '#1890ff', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '14px' },
  cancelBtn: { padding: '8px 24px', background: '#fff', color: '#333', border: '1px solid #d9d9d9', borderRadius: '4px', fontSize: '14px' },
};
