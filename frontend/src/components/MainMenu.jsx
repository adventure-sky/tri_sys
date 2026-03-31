import { useState } from 'react';
import CustMaint from './CustMaint';
import FactMaint from './FactMaint';
import ItemMaint from './ItemMaint';
import UserMaint from './UserMaint';

const MENU_ITEMS = [
  {
    key: 'cust',
    label: '客戶資料維護',
    desc: '管理與更新全球客戶基本資料、信用評等與合約現況。',
    icon: 'person',
    color: '#1890ff',
    shadow: 'shadow-[#1890ff]/20',
    hover: 'from-[#1890ff]/5',
    textColor: 'text-[#1890ff]',
  },
  {
    key: 'fact',
    label: '廠商資料維護',
    desc: '維護供應鏈體系，監控廠商供貨穩定度與採購歷史明細。',
    icon: 'factory',
    color: '#52c41a',
    shadow: 'shadow-[#52c41a]/20',
    hover: 'from-[#52c41a]/5',
    textColor: 'text-[#52c41a]',
  },
  {
    key: 'item',
    label: '商品資料維護',
    desc: '建立商品規格、定價策略以及全球倉儲庫存調度設定。',
    icon: 'inventory_2',
    color: '#fa8c16',
    shadow: 'shadow-[#fa8c16]/20',
    hover: 'from-[#fa8c16]/5',
    textColor: 'text-[#fa8c16]',
  },
  {
    key: 'user',
    label: '用戶資料維護',
    desc: '系統權限分配、登入日誌審查及內部人員帳號安全性控管。',
    icon: 'manage_accounts',
    color: '#722ed1',
    shadow: 'shadow-[#722ed1]/20',
    hover: 'from-[#722ed1]/5',
    textColor: 'text-[#722ed1]',
  },
];

const VIEWS = {
  cust: <CustMaint />,
  fact: <FactMaint />,
  item: <ItemMaint />,
  user: <UserMaint />,
};

const NAV_ITEMS = [
  { icon: 'dashboard', label: '主選單', key: 'menu' },
  { icon: 'database', label: '資料維護', key: 'data' },
  { icon: 'settings', label: '系統設定', key: 'settings' },
  { icon: 'analytics', label: '報表查詢', key: 'reports' },
];

export default function MainMenu({ user, onLogout }) {
  const [view, setView] = useState(null);

  const activeNav = view ? 'data' : 'menu';
  const isDataView = view && view !== 'data';

  return (
    <div className="bg-surface text-on-background min-h-screen flex flex-col">
      {/* TopNavBar */}
      <header className="bg-[#001529] flex justify-between items-center w-full px-8 h-16 fixed top-0 z-50 shadow-lg shadow-blue-900/10">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 bg-primary rounded flex items-center justify-center">
            <span className="material-symbols-outlined text-white text-lg">layers</span>
          </span>
          <span className="text-xl font-bold text-white tracking-tight">三層式資料維護系統</span>
        </div>
        <div className="flex items-center space-x-6">
          <span className="text-slate-300 text-sm">歡迎，{user.username}</span>
          <button
            onClick={onLogout}
            className="bg-white/10 hover:bg-white/20 text-white px-4 py-1.5 rounded text-sm transition-all duration-200 active:scale-95"
          >
            登出
          </button>
        </div>
      </header>

      <div className="flex flex-1">
        {/* SideNavBar */}
        <aside className="bg-[#001529] fixed left-0 top-16 h-[calc(100vh-64px)] w-64 flex flex-col border-r border-white/5 shadow-2xl shadow-black/20 z-40">
          <div className="p-6">
            <div className="text-lg font-black text-white">資料管理</div>
            <div className="text-xs text-slate-500 mt-1">V2.4.0</div>
          </div>
          <nav className="flex-1 mt-2">
            {NAV_ITEMS.map(({ icon, label, key }) => (
              <a
                key={key}
                href="#"
                onClick={e => {
                  e.preventDefault();
                  if (key === 'menu') setView(null);
                  if (key === 'data') setView('data');
                }}
                className={`flex items-center space-x-3 py-3 px-6 transition-all ${
                  activeNav === key
                    ? 'text-white bg-blue-600/10 border-l-4 border-blue-500'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="material-symbols-outlined">{icon}</span>
                <span className="text-sm font-medium">{label}</span>
              </a>
            ))}
          </nav>
          <div className="border-t border-white/5">
            <a
              href="#"
              onClick={e => { e.preventDefault(); setView(null); }}
              className="flex items-center space-x-3 text-slate-400 hover:text-white py-4 px-6 transition-all hover:bg-white/5"
            >
              <span className="material-symbols-outlined">arrow_back</span>
              <span className="text-sm font-medium">返回主選單</span>
            </a>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 ml-64 mt-16 p-8 md:p-12 bg-surface overflow-y-auto min-h-[calc(100vh-64px)]">
          {!view ? (
            /* ── 主選單卡片 ── */
            <div className="max-w-6xl mx-auto">
              <div className="mb-12">
                <h1 className="text-[1.5rem] font-bold text-on-surface mb-2">請選擇功能</h1>
                <div className="h-1 w-12 bg-primary rounded-full"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-items-center md:justify-items-start">
                {MENU_ITEMS.map(({ key, label, desc, icon, color, hover, textColor }) => (
                  <button
                    key={key}
                    onClick={() => setView(key)}
                    className={`group relative w-full max-w-[320px] md:w-[240px] aspect-square bg-surface-container-lowest rounded-xl shadow-[0_12px_32px_rgba(0,93,170,0.06)] overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_48px_rgba(0,93,170,0.12)] flex flex-col items-center justify-center p-6 text-center`}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${hover} to-transparent opacity-0 group-hover:opacity-100 transition-opacity`}></div>
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center text-white mb-6 shadow-lg"
                      style={{ backgroundColor: color }}
                    >
                      <span className="material-symbols-outlined text-3xl">{icon}</span>
                    </div>
                    <h3 className="text-lg font-bold text-on-surface mb-2">{label}</h3>
                    <p className="text-xs text-on-surface-variant leading-relaxed">{desc}</p>
                    <div className={`mt-4 flex items-center ${textColor} text-xs font-bold opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0`}>
                      立即進入 <span className="material-symbols-outlined text-sm ml-1">arrow_forward</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Status Panel */}
              <div className="mt-16 glass-panel p-8 rounded-2xl border border-white/20 shadow-xl overflow-hidden relative group">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                  <span className="material-symbols-outlined text-9xl text-primary">query_stats</span>
                </div>
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <h4 className="text-xl font-bold text-primary mb-2">系統狀態概覽</h4>
                    <p className="text-sm text-on-surface-variant max-w-xl">
                      目前系統運作正常，最近一次備份於 2024-05-24 04:00 AM 完成。本月已處理 1,284 筆維護異動記錄。
                    </p>
                  </div>
                  <button className="px-6 py-3 bg-primary text-white font-bold rounded shadow-md hover:bg-primary-container transition-all active:scale-95">
                    查看完整報告
                  </button>
                </div>
              </div>
            </div>
          ) : view === 'data' ? (
            /* ── 資料維護選擇 ── */
            <div className="max-w-6xl mx-auto">
              <div className="mb-12">
                <h1 className="text-[1.5rem] font-bold text-on-surface mb-2">資料維護</h1>
                <div className="h-1 w-12 bg-primary rounded-full"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-items-center md:justify-items-start">
                {MENU_ITEMS.map(({ key, label, desc, icon, color, hover, textColor }) => (
                  <button
                    key={key}
                    onClick={() => setView(key)}
                    className="group relative w-full max-w-[320px] md:w-[240px] aspect-square bg-surface-container-lowest rounded-xl shadow-[0_12px_32px_rgba(0,93,170,0.06)] overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_48px_rgba(0,93,170,0.12)] flex flex-col items-center justify-center p-6 text-center"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${hover} to-transparent opacity-0 group-hover:opacity-100 transition-opacity`}></div>
                    <div className="w-16 h-16 rounded-full flex items-center justify-center text-white mb-6 shadow-lg" style={{ backgroundColor: color }}>
                      <span className="material-symbols-outlined text-3xl">{icon}</span>
                    </div>
                    <h3 className="text-lg font-bold text-on-surface mb-2">{label}</h3>
                    <p className="text-xs text-on-surface-variant leading-relaxed">{desc}</p>
                    <div className={`mt-4 flex items-center ${textColor} text-xs font-bold opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0`}>
                      立即進入 <span className="material-symbols-outlined text-sm ml-1">arrow_forward</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* ── 資料維護內容 ── */
            <div className="max-w-6xl mx-auto">
              <div className="mb-6">
                <button
                  onClick={() => setView('data')}
                  className="group flex items-center text-on-surface-variant hover:text-primary transition-colors text-sm font-medium"
                >
                  <span className="material-symbols-outlined mr-2 text-lg group-hover:-translate-x-1 transition-transform">arrow_back</span>
                  返回資料維護
                </button>
              </div>
              {VIEWS[view]}
            </div>
          )}
        </main>
      </div>

      {/* Background decorations */}
      <div className="fixed top-0 right-0 -z-10 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
      <div className="fixed bottom-0 left-0 -z-10 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[80px] -translate-x-1/2 translate-y-1/2 pointer-events-none"></div>
    </div>
  );
}
