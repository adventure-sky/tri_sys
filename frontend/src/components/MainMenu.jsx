import { useState } from 'react';
import CustMaint from './CustMaint';
import FactMaint from './FactMaint';
import ItemMaint from './ItemMaint';
import UserMaint from './UserMaint';

const VIEWS = {
  cust: <CustMaint />,
  fact: <FactMaint />,
  item: <ItemMaint />,
  user: <UserMaint />,
};

const MENU_ITEMS = [
  { key: 'cust', label: '客戶資料維護', color: '#1890ff' },
  { key: 'fact', label: '廠商資料維護', color: '#52c41a' },
  { key: 'item', label: '商品資料維護', color: '#fa8c16' },
  { key: 'user', label: '用戶資料維護', color: '#722ed1' },
];

export default function MainMenu({ user, onLogout }) {
  const [view, setView] = useState(null);

  return (
    <div style={s.container}>
      <div style={s.header}>
        <span style={s.sysTitle}>三層式資料維護系統</span>
        <span style={s.userInfo}>
          歡迎，{user.username}
          <button onClick={onLogout} style={s.logoutBtn}>登出</button>
        </span>
      </div>

      <div style={s.content}>
        {!view ? (
          <div>
            <h3 style={s.menuTitle}>請選擇功能</h3>
            <div style={s.grid}>
              {MENU_ITEMS.map(({ key, label, color }) => (
                <button
                  key={key}
                  style={{ ...s.menuBtn, background: color }}
                  onClick={() => setView(key)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <button style={s.backBtn} onClick={() => setView(null)}>← 返回主選單</button>
            {VIEWS[view]}
          </div>
        )}
      </div>
    </div>
  );
}

const s = {
  container: { minHeight: '100vh', background: '#f0f2f5' },
  header: { background: '#001529', color: '#fff', padding: '12px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  sysTitle: { fontSize: '18px', fontWeight: 'bold' },
  userInfo: { fontSize: '14px', display: 'flex', alignItems: 'center', gap: '12px' },
  logoutBtn: { padding: '4px 12px', background: 'transparent', color: '#fff', border: '1px solid #fff', borderRadius: '4px', fontSize: '13px' },
  content: { padding: '32px' },
  menuTitle: { marginBottom: '24px', color: '#333', fontSize: '16px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(2, 240px)', gap: '16px' },
  menuBtn: { padding: '40px 20px', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '18px', fontWeight: '500', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' },
  backBtn: { marginBottom: '16px', padding: '6px 16px', background: '#fff', border: '1px solid #d9d9d9', borderRadius: '4px', fontSize: '14px' },
};
