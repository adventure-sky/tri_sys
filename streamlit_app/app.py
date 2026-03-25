import streamlit as st
from db import db_query
from maint import maint_page

st.set_page_config(page_title="三層式資料維護系統", page_icon="📊", layout="wide")

# ── Session state init ────────────────────────────────────────────
for key, default in [("logged_in", False), ("user", None), ("page", "menu")]:
    if key not in st.session_state:
        st.session_state[key] = default

# ── Module config ─────────────────────────────────────────────────
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
    },
}

# ── Login page ────────────────────────────────────────────────────
def show_login():
    col1, col2, col3 = st.columns([1, 1.2, 1])
    with col2:
        st.markdown("<br><br>", unsafe_allow_html=True)
        st.title("📊 三層式資料維護系統")
        st.markdown("---")
        with st.form("login_form"):
            userid = st.text_input("用戶代碼")
            pwd = st.text_input("密碼", type="password")
            if st.form_submit_button("登入", use_container_width=True):
                rows = db_query(
                    "SELECT userid, username FROM [user] WHERE userid=? AND pwd=?",
                    (userid, pwd)
                )
                if rows:
                    st.session_state.logged_in = True
                    st.session_state.user = rows[0]
                    st.rerun()
                else:
                    st.error("用戶名稱或密碼錯誤")

# ── Main menu ─────────────────────────────────────────────────────
def show_menu():
    st.title("主選單")
    st.markdown(f"歡迎，**{st.session_state.user['username']}**")
    st.markdown("---")
    cols = st.columns(4)
    buttons = [
        ("cust", "👥 客戶資料維護"),
        ("fact", "🏭 廠商資料維護"),
        ("item", "📦 商品資料維護"),
        ("user", "👤 用戶資料維護"),
    ]
    for col, (key, label) in zip(cols, buttons):
        if col.button(label, use_container_width=True, key=f"menu_{key}"):
            st.session_state.page = key
            st.rerun()

# ── Header (after login) ──────────────────────────────────────────
def show_header():
    col1, col2 = st.columns([6, 1])
    col1.markdown("### 三層式資料維護系統")
    if col2.button("登出"):
        st.session_state.logged_in = False
        st.session_state.user = None
        st.session_state.page = "menu"
        st.rerun()
    st.markdown("---")

# ── Router ────────────────────────────────────────────────────────
if not st.session_state.logged_in:
    show_login()
else:
    show_header()
    page = st.session_state.page
    if page == "menu":
        show_menu()
    elif page in MODULES:
        m = MODULES[page]
        maint_page(m["title"], m["table"], m["key_field"], m["fields"])
