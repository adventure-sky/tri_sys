import streamlit as st
from db import db_query
from maint import maint_page

st.set_page_config(
    page_title="三層式資料維護系統",
    page_icon="🗄️",
    layout="wide",
    initial_sidebar_state="expanded",
)

CSS = """
<style>
#MainMenu { visibility: hidden; }
footer { visibility: hidden; }
header { visibility: hidden; }
[data-testid="stToolbar"] { display: none !important; }
.stDeployButton { display: none !important; }

.stApp { background-color: #f7f9fc; }
.block-container { padding-top: 2rem !important; padding-bottom: 2rem !important; }

/* ── Sidebar ── */
[data-testid="stSidebar"] { background-color: #001529 !important; }
[data-testid="stSidebar"] .stButton > button {
    background: transparent !important;
    border: none !important;
    border-radius: 8px !important;
    color: #8fa8c8 !important;
    font-size: 14px !important;
    font-weight: 500 !important;
    text-align: left !important;
    width: 100% !important;
    padding: 10px 16px !important;
    margin: 2px 0 !important;
}
[data-testid="stSidebar"] .stButton > button:hover {
    background: rgba(255,255,255,0.08) !important;
    color: #ffffff !important;
}

/* ── Primary button ── */
button[data-testid="baseButton-primary"] {
    background: linear-gradient(to bottom, #005daa, #0075d5) !important;
    border: none !important;
    border-radius: 8px !important;
    color: white !important;
    font-weight: 600 !important;
    box-shadow: 0 2px 8px rgba(0,93,170,0.25) !important;
}
button[data-testid="baseButton-primary"]:hover { filter: brightness(1.1) !important; }

/* ── Secondary button ── */
button[data-testid="baseButton-secondary"] {
    background: white !important;
    border: 1px solid #d9e1ec !important;
    border-radius: 8px !important;
    color: #4a5568 !important;
    font-weight: 500 !important;
}

/* ── Text input ── */
.stTextInput > div > div > input {
    background: white !important;
    border: 1px solid #d9e1ec !important;
    border-radius: 8px !important;
    color: #191c1e !important;
    font-size: 14px !important;
}
.stTextInput > div > div > input:focus {
    border-color: #005daa !important;
    box-shadow: 0 0 0 3px rgba(0,93,170,0.12) !important;
}
.stTextInput label { color: #374151 !important; font-size: 13px !important; font-weight: 600 !important; }

/* ── Selectbox ── */
.stSelectbox > div > div {
    background: white !important;
    border: 1px solid #d9e1ec !important;
    border-radius: 8px !important;
}
.stSelectbox label { color: #374151 !important; font-size: 13px !important; font-weight: 600 !important; }

/* ── Tabs ── */
.stTabs [data-baseweb="tab-list"] {
    background: transparent !important;
    border-bottom: 2px solid #e8edf2 !important;
    gap: 0 !important;
}
.stTabs [data-baseweb="tab"] {
    background: transparent !important;
    border: none !important;
    border-bottom: 2px solid transparent !important;
    color: #6b7280 !important;
    font-weight: 500 !important;
    font-size: 14px !important;
    padding: 10px 20px !important;
    margin-bottom: -2px !important;
}
.stTabs [aria-selected="true"] {
    color: #005daa !important;
    border-bottom-color: #005daa !important;
    background: transparent !important;
}

/* ── Form container ── */
[data-testid="stForm"] {
    background: white !important;
    border: 1px solid #e8edf2 !important;
    border-radius: 12px !important;
    padding: 1.5rem !important;
}

/* ── Alerts ── */
.stAlert { border-radius: 8px !important; font-size: 14px !important; }
</style>
"""

MODULES = {
    "cust": {
        "title": "客戶資料維護",
        "table": "cust",
        "key_field": "cust_code",
        "fields": [
            {"name": "cust_code",   "caption": "客戶代碼"},
            {"name": "cust_name",   "caption": "客戶名稱"},
            {"name": "cust_remark", "caption": "備註說明"},
        ],
        "icon": "👥", "color": "#1890ff", "desc": "管理與更新客戶基本資料",
    },
    "fact": {
        "title": "廠商資料維護",
        "table": "fact",
        "key_field": "fact_code",
        "fields": [
            {"name": "fact_code",   "caption": "廠商代碼"},
            {"name": "fact_name",   "caption": "廠商名稱"},
            {"name": "fact_remark", "caption": "備註說明"},
        ],
        "icon": "🏭", "color": "#52c41a", "desc": "維護供應鏈廠商資料",
    },
    "item": {
        "title": "商品資料維護",
        "table": "item",
        "key_field": "item_code",
        "fields": [
            {"name": "item_code",   "caption": "商品代碼"},
            {"name": "item_name",   "caption": "商品名稱"},
            {"name": "item_remark", "caption": "備註說明"},
        ],
        "icon": "📦", "color": "#fa8c16", "desc": "建立商品規格與庫存資料",
    },
    "user": {
        "title": "用戶資料維護",
        "table": "user",
        "key_field": "userid",
        "fields": [
            {"name": "userid",   "caption": "用戶代碼"},
            {"name": "username", "caption": "用戶名稱"},
            {"name": "pwd",      "caption": "用戶密碼"},
        ],
        "icon": "👤", "color": "#722ed1", "desc": "系統帳號與權限管理",
    },
}

for k, v in [("logged_in", False), ("user", None), ("page", "menu")]:
    if k not in st.session_state:
        st.session_state[k] = v

st.markdown(CSS, unsafe_allow_html=True)


# ── Login ──────────────────────────────────────────────────────────
def show_login():
    _, col, _ = st.columns([1, 1.2, 1])
    with col:
        st.markdown("<br><br>", unsafe_allow_html=True)
        st.markdown("""
        <div style="text-align:center;margin-bottom:2rem;">
            <div style="width:52px;height:52px;background:linear-gradient(to bottom,#005daa,#0075d5);
                        border-radius:12px;display:inline-flex;align-items:center;
                        justify-content:center;font-size:26px;margin-bottom:14px;">🗄️</div>
            <h2 style="color:#191c1e;font-size:1.5rem;font-weight:700;margin:0;">三層式資料維護系統</h2>
            <p style="color:#6b7280;font-size:14px;margin-top:6px;">請登入以繼續使用</p>
        </div>
        """, unsafe_allow_html=True)
        with st.form("login_form"):
            userid = st.text_input("用戶代碼", placeholder="請輸入用戶代碼")
            pwd    = st.text_input("密碼", type="password", placeholder="請輸入密碼")
            if st.form_submit_button("登入", use_container_width=True, type="primary"):
                rows = db_query(
                    "SELECT userid, username FROM [user] WHERE userid=%s AND pwd=%s",
                    (userid, pwd),
                )
                if rows:
                    st.session_state.logged_in = True
                    st.session_state.user = rows[0]
                    st.rerun()
                else:
                    st.error("用戶代碼或密碼錯誤")


# ── Sidebar ────────────────────────────────────────────────────────
def show_sidebar():
    with st.sidebar:
        st.markdown("""
        <div style="padding:20px 16px 14px;border-bottom:1px solid rgba(255,255,255,0.07);margin-bottom:8px;">
            <div style="display:flex;align-items:center;gap:10px;">
                <div style="width:34px;height:34px;background:linear-gradient(to bottom,#005daa,#0075d5);
                            border-radius:8px;display:flex;align-items:center;
                            justify-content:center;font-size:18px;">🗄️</div>
                <div>
                    <div style="color:#ffffff;font-weight:700;font-size:14px;">資料管理</div>
                    <div style="color:#4a7a9b;font-size:11px;">V2.4.0</div>
                </div>
            </div>
        </div>
        """, unsafe_allow_html=True)

        page = st.session_state.page
        for key, label in [("menu", "主選單"), ("data", "資料維護")]:
            is_active = page == key or (key == "data" and page in MODULES)
            prefix = "▶ " if is_active else "　"
            if st.button(f"{prefix}{label}", key=f"nav_{key}", use_container_width=True):
                st.session_state.page = key
                st.rerun()

        st.markdown("<br>" * 8, unsafe_allow_html=True)
        st.markdown(f"""
        <div style="padding:12px 16px 8px;border-top:1px solid rgba(255,255,255,0.07);">
            <div style="color:#4a7a9b;font-size:11px;margin-bottom:2px;">登入帳號</div>
            <div style="color:#ffffff;font-size:14px;font-weight:600;">
                {st.session_state.user['username']}
            </div>
        </div>
        """, unsafe_allow_html=True)
        if st.button("登出", key="logout", use_container_width=True):
            st.session_state.logged_in = False
            st.session_state.user = None
            st.session_state.page = "menu"
            st.rerun()


# ── Main Menu ──────────────────────────────────────────────────────
def show_menu():
    st.markdown("""
    <h2 style="font-size:1.4rem;font-weight:700;color:#191c1e;margin-bottom:4px;">主選單</h2>
    <p style="color:#6b7280;font-size:14px;margin-bottom:20px;">選擇要維護的資料模組</p>
    """, unsafe_allow_html=True)

    cols = st.columns(2)
    for i, (key, m) in enumerate(MODULES.items()):
        with cols[i % 2]:
            st.markdown(f"""
            <div style="background:white;border-radius:12px;padding:22px 20px 12px;
                        box-shadow:0 2px 12px rgba(0,0,0,0.06);border:1px solid #e8edf2;margin-bottom:4px;">
                <div style="font-size:2rem;margin-bottom:10px;">{m['icon']}</div>
                <div style="font-size:15px;font-weight:700;color:#191c1e;">{m['title']}</div>
                <div style="font-size:13px;color:#6b7280;margin-top:4px;margin-bottom:12px;">{m['desc']}</div>
            </div>
            """, unsafe_allow_html=True)
            if st.button(f"進入 {m['title']}", key=f"menu_{key}",
                         use_container_width=True, type="primary"):
                st.session_state.page = key
                st.rerun()
            st.markdown("<br>", unsafe_allow_html=True)


# ── Router ─────────────────────────────────────────────────────────
if not st.session_state.logged_in:
    show_login()
else:
    show_sidebar()
    page = st.session_state.page
    if page in ("menu", "data"):
        show_menu()
    elif page in MODULES:
        m = MODULES[page]
        maint_page(m["title"], m["table"], m["key_field"], m["fields"])
