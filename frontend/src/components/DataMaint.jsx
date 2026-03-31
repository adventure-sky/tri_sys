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
    if (!window.confirm('確定要刪除此筆資料？')) return;
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

  /* ── Edit Mode ── */
  if (mode === 'edit') {
    const isEdit = !!editKey;
    return (
      <div>
        {/* Breadcrumb */}
        <nav className="flex mb-8 text-xs text-on-surface-variant gap-2 items-center">
          <span>資料維護</span>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <span className="text-primary font-medium">{title}</span>
        </nav>

        {/* Page Header */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-[1.5rem] font-bold text-on-surface tracking-tight leading-tight">{title}</h1>
            <p className="text-sm text-on-surface-variant mt-1">管理並更新您的核心資料庫，確保資訊的準確性。</p>
          </div>
          <div className="flex items-center gap-3 bg-green-50 px-4 py-2 rounded-xl border border-green-100">
            <span className="material-symbols-outlined text-green-600 text-sm">check_circle</span>
            <span className="text-green-700 font-medium text-sm">系統狀態：連線中</span>
          </div>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-12 gap-8">
          {/* Form Card */}
          <div className="col-span-12 lg:col-span-8 bg-surface-container-lowest rounded-xl shadow-[0_12px_32px_rgba(0,93,170,0.04)] overflow-hidden">
            <div className="px-8 py-6 bg-surface-container-low/50 border-b border-outline-variant/10">
              <h2 className="text-[1.125rem] font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">edit_square</span>
                {isEdit ? '修改' : '新增'} {title}
              </h2>
            </div>

            <form onSubmit={e => { e.preventDefault(); handleSave(); }} className="p-8 space-y-8">
              <div className="space-y-6">
                {fields.map(f => {
                  const isReadonly = f.name === keyField && isEdit;
                  const isTextarea = f.name.includes('remark');
                  return (
                    <div key={f.name} className="space-y-2">
                      <label className="text-[0.875rem] font-semibold text-on-surface flex items-center gap-2">
                        {f.caption}
                        {isReadonly && (
                          <span className="material-symbols-outlined text-[14px] text-on-surface-variant" title="唯讀資訊">info</span>
                        )}
                      </label>
                      {isReadonly ? (
                        <div className="bg-surface-container-highest px-4 py-3 rounded-lg border border-outline-variant/20 text-on-surface-variant font-mono text-sm">
                          {form[f.name] ?? ''}
                        </div>
                      ) : isTextarea ? (
                        <textarea
                          value={form[f.name] ?? ''}
                          onChange={e => setForm({ ...form, [f.name]: e.target.value })}
                          rows={4}
                          placeholder={`請輸入${f.caption}...`}
                          className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-on-surface resize-none"
                        />
                      ) : (
                        <input
                          type="text"
                          value={form[f.name] ?? ''}
                          onChange={e => setForm({ ...form, [f.name]: e.target.value })}
                          placeholder={`請輸入${f.caption}`}
                          className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-on-surface"
                        />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Messages */}
              {msg.text && (
                <div className={`flex items-center gap-2 text-sm font-medium ${msg.type === 'error' ? 'text-error' : 'text-green-600'}`}>
                  <span className="material-symbols-outlined text-[18px]">
                    {msg.type === 'error' ? 'error' : 'verified'}
                  </span>
                  {msg.text}
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-4 pt-6 border-t border-outline-variant/10">
                <button
                  type="submit"
                  disabled={loading}
                  className="primary-gradient text-white px-8 py-2.5 rounded-lg font-semibold text-sm hover:brightness-110 active:scale-95 transition-all shadow-md shadow-primary/20 disabled:opacity-60"
                >
                  {loading ? '儲存中...' : '儲存'}
                </button>
                <button
                  type="button"
                  onClick={() => setMode('list')}
                  className="bg-white border border-outline-variant/60 text-on-surface-variant px-8 py-2.5 rounded-lg font-semibold text-sm hover:bg-surface-container-low active:scale-95 transition-all"
                >
                  取消
                </button>
              </div>
            </form>
          </div>

          {/* Sidebar */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            <div className="bg-surface-container-lowest rounded-xl shadow-[0_12px_32px_rgba(0,93,170,0.04)] p-6 relative overflow-hidden">
              <div className="absolute -right-12 -top-12 w-32 h-32 bg-primary/5 rounded-full blur-3xl"></div>
              <h3 className="text-sm font-bold text-on-surface mb-4">資料摘要</h3>
              {isEdit ? (
                <div className="space-y-3">
                  <div className="flex justify-between text-xs py-2 border-b border-outline-variant/10">
                    <span className="text-on-surface-variant">主鍵值</span>
                    <span className="text-primary font-bold font-mono">{editKey}</span>
                  </div>
                  <div className="flex justify-between text-xs py-2">
                    <span className="text-on-surface-variant">操作模式</span>
                    <span className="text-amber-600 font-bold">修改中</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex justify-between text-xs py-2">
                    <span className="text-on-surface-variant">操作模式</span>
                    <span className="text-green-600 font-bold">新增資料</span>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-primary/5 rounded-xl p-6 border border-primary/10">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary mt-0.5">info</span>
                <div>
                  <p className="text-xs font-semibold text-on-surface mb-1">操作提示</p>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    填寫完成後點選「儲存」按鈕確認變更。點選「取消」將返回列表並放棄本次修改。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── List Mode ── */
  return (
    <div>
      {/* Content Card */}
      <div className="bg-surface-container-lowest rounded-xl shadow-[0_12px_32px_rgba(0,93,170,0.06)] overflow-hidden">
        {/* Card Header */}
        <div className="px-8 pt-8 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-[1.125rem] font-bold text-on-surface flex items-center gap-2">
            <span className="w-1.5 h-6 bg-primary rounded-full"></span>
            {title}
          </h1>
          <div className="flex items-center gap-3">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg">search</span>
              <input
                type="text"
                placeholder="搜尋..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2 bg-surface-container-highest border-none rounded focus:ring-2 focus:ring-primary/20 w-64 text-sm transition-all"
              />
            </div>
            <button
              onClick={handleNew}
              className="primary-gradient text-white px-5 py-2 rounded font-medium flex items-center gap-2 hover:brightness-110 active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-lg">add</span>
              新增
            </button>
          </div>
        </div>

        {/* Message */}
        {msg.text && (
          <div className={`mx-8 mb-4 flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg ${
            msg.type === 'error' ? 'bg-error/5 text-error' : 'bg-green-50 text-green-700'
          }`}>
            <span className="material-symbols-outlined text-base">
              {msg.type === 'error' ? 'error' : 'check_circle'}
            </span>
            {msg.text}
          </div>
        )}

        {/* Table */}
        <div className="px-8 pb-8">
          <div className="overflow-x-auto rounded-lg">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-surface-container-low text-on-surface-variant font-semibold">
                  {fields.map(f => (
                    <th key={f.name} className="px-6 py-4">{f.caption}</th>
                  ))}
                  <th className="px-6 py-4 text-center">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={fields.length + 1} className="px-6 py-12 text-center text-on-surface-variant">
                      <span className="material-symbols-outlined text-4xl block mb-2 opacity-30">inbox</span>
                      無資料
                    </td>
                  </tr>
                ) : (
                  filtered.map((rec, i) => (
                    <tr
                      key={rec[keyField]}
                      className={`transition-colors ${i % 2 === 0 ? 'bg-white hover:bg-surface-container/50' : 'bg-surface-container-low hover:bg-surface-container/80'}`}
                    >
                      {fields.map((f, fi) => (
                        <td key={f.name} className={`px-6 py-4 ${fi === 0 ? 'font-mono text-primary font-medium' : fi === 1 ? 'font-semibold' : 'text-on-surface-variant'}`}>
                          {rec[f.name]}
                        </td>
                      ))}
                      <td className="px-6 py-4">
                        <div className="flex justify-center items-center gap-2">
                          <button
                            onClick={() => handleEdit(rec)}
                            className="text-primary hover:bg-primary/5 px-3 py-1 rounded transition-colors flex items-center gap-1 border border-primary/20 text-xs font-medium"
                          >
                            <span className="material-symbols-outlined text-base">edit</span>
                            修改
                          </button>
                          <button
                            onClick={() => handleDelete(rec[keyField])}
                            className="text-error hover:bg-error/5 px-3 py-1 rounded transition-colors flex items-center gap-1 border border-error/20 text-xs font-medium"
                          >
                            <span className="material-symbols-outlined text-base">delete</span>
                            刪除
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination / Count */}
          <div className="mt-6 flex items-center justify-end border-t border-outline-variant/10 pt-6">
            <div className="text-on-surface-variant text-sm font-medium bg-surface-container px-4 py-1.5 rounded-full">
              共 <span className="text-primary font-bold mx-1">{filtered.length}</span> 筆
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-primary/5 p-6 rounded-xl border border-primary/10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded bg-primary flex items-center justify-center text-white">
              <span className="material-symbols-outlined">dataset</span>
            </div>
            <div>
              <div className="text-xs text-on-surface-variant">總筆數</div>
              <div className="text-2xl font-bold text-primary">{records.length}</div>
            </div>
          </div>
        </div>

        <div className="bg-secondary/5 p-6 rounded-xl border border-secondary/10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded bg-secondary flex items-center justify-center text-white">
              <span className="material-symbols-outlined">filter_alt</span>
            </div>
            <div>
              <div className="text-xs text-on-surface-variant">篩選結果</div>
              <div className="text-2xl font-bold text-secondary">{filtered.length}</div>
            </div>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-xl border border-white/20 shadow-sm relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 opacity-5">
            <span className="material-symbols-outlined" style={{ fontSize: '5rem' }}>analytics</span>
          </div>
          <div className="text-xs text-on-surface-variant">系統最後維護時間</div>
          <div className="text-sm font-semibold mt-1">{new Date().toLocaleString('zh-TW')}</div>
          <div className="text-xs text-primary mt-2 flex items-center gap-1">
            <span className="material-symbols-outlined text-xs">sync</span>
            系統運作正常
          </div>
        </div>
      </div>
    </div>
  );
}
