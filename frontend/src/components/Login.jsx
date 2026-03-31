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
    <div className="bg-surface-container-low min-h-screen flex items-center justify-center p-4">
      <main className="w-full max-w-[340px]">
        {/* Brand */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-4">
            <span className="material-symbols-outlined text-primary text-3xl">account_tree</span>
          </div>
          <h1 className="text-[1.125rem] font-bold text-primary tracking-tight mb-1">三層式資料維護系統</h1>
          <p className="text-on-surface-variant text-[0.875rem]">請登入以繼續</p>
        </div>

        {/* Login Card */}
        <div className="bg-surface-container-lowest rounded-xl shadow-[0_12px_32px_rgba(0,93,170,0.06)] overflow-hidden">
          <div className="p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* User ID */}
              <div className="space-y-1.5">
                <label htmlFor="user_id" className="text-[0.75rem] font-medium text-on-surface-variant block px-1">
                  用戶代碼
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-outline text-lg">person</span>
                  </div>
                  <input
                    id="user_id"
                    type="text"
                    value={userid}
                    onChange={e => setUserid(e.target.value)}
                    placeholder="請輸入您的帳號"
                    required
                    autoFocus
                    className="block w-full pl-10 pr-3 py-2.5 bg-surface-container-highest border-transparent focus:border-primary focus:ring-0 rounded-lg text-on-surface text-[0.875rem] transition-all placeholder:text-outline-variant"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label htmlFor="password" className="text-[0.75rem] font-medium text-on-surface-variant block px-1">
                  密碼
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-outline text-lg">lock</span>
                  </div>
                  <input
                    id="password"
                    type="password"
                    value={pwd}
                    onChange={e => setPwd(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="block w-full pl-10 pr-3 py-2.5 bg-surface-container-highest border-transparent focus:border-primary focus:ring-0 rounded-lg text-on-surface text-[0.875rem] transition-all placeholder:text-outline-variant"
                  />
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-center gap-2 text-error text-[0.8125rem] font-medium px-1">
                  <span className="material-symbols-outlined text-base">error</span>
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="primary-gradient w-full py-3 px-4 rounded-lg text-white font-semibold text-[0.875rem] shadow-md shadow-primary/20 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center space-x-2 disabled:opacity-60"
              >
                <span>{loading ? '登入中...' : '登入'}</span>
                {!loading && <span className="material-symbols-outlined text-sm">login</span>}
              </button>
            </form>
          </div>

          {/* Card Footer */}
          <div className="bg-surface-container-low px-6 py-4 flex justify-center border-t border-outline-variant/10">
            <p className="text-[0.75rem] text-on-surface-variant">
              系統版本 <span className="font-mono font-medium">V2.4.0</span>
            </p>
          </div>
        </div>

        {/* Status */}
        <div className="mt-8 flex items-center justify-center space-x-4">
          <div className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="text-[0.625rem] font-medium text-on-surface-variant uppercase tracking-widest">System Online</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-outline-variant"></div>
          <div className="flex items-center space-x-1.5">
            <span className="material-symbols-outlined text-xs text-on-surface-variant">language</span>
            <span className="text-[0.625rem] font-medium text-on-surface-variant uppercase tracking-widest">Secure Server</span>
          </div>
        </div>
      </main>

      {/* Background decoration */}
      <div className="fixed top-0 right-0 -z-10 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-primary/10 blur-[100px]"></div>
        <div className="absolute bottom-[-5%] right-[5%] w-[300px] h-[300px] rounded-full bg-secondary/10 blur-[80px]"></div>
      </div>
    </div>
  );
}
