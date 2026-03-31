import streamlit as st
from db import db_query, db_exec

TH = ("padding:12px 16px;text-align:left;font-size:13px;font-weight:600;"
      "color:#374151;border-bottom:2px solid #e8edf2;")
TD = "padding:11px 16px;font-size:14px;color:#191c1e;"


def _table_html(fields, rows):
    headers = "".join(f'<th style="{TH}">{f["caption"]}</th>' for f in fields)
    body = ""
    for i, r in enumerate(rows):
        bg = "#ffffff" if i % 2 == 0 else "#f8fafc"
        cells = ""
        for j, f in enumerate(fields):
            val = r.get(f["name"], "") or ""
            if j == 0:
                style = TD + "font-family:monospace;color:#005daa;font-weight:600;"
            elif j == 1:
                style = TD + "font-weight:600;"
            else:
                style = TD + "color:#6b7280;"
            cells += f'<td style="{style}">{val}</td>'
        body += f'<tr style="background:{bg};">{cells}</tr>'
    return f"""
    <div style="border:1px solid #e8edf2;border-radius:10px;overflow:hidden;margin-top:8px;">
        <table style="width:100%;border-collapse:collapse;">
            <thead><tr style="background:#f1f5f9;">{headers}</tr></thead>
            <tbody>{body}</tbody>
        </table>
    </div>"""


def maint_page(title, table, key_field, fields):
    # Header
    col_back, col_title = st.columns([1, 8])
    with col_back:
        if st.button("← 返回", key=f"{table}_back"):
            st.session_state.page = "menu"
            st.rerun()
    with col_title:
        st.markdown(f"""
        <div>
            <h2 style="font-size:1.4rem;font-weight:700;color:#191c1e;margin:0;">{title}</h2>
            <p style="color:#6b7280;font-size:13px;margin-top:2px;">管理並更新資料庫，確保資訊的準確性。</p>
        </div>
        """, unsafe_allow_html=True)

    st.markdown("<br>", unsafe_allow_html=True)
    tab_list, tab_add, tab_edit, tab_del = st.tabs(["📋 查詢列表", "➕ 新增", "✏️ 修改", "🗑️ 刪除"])

    # ── 查詢列表 ──────────────────────────────────────────────────
    with tab_list:
        col_search, col_count = st.columns([4, 1])
        with col_search:
            search = st.text_input("搜尋", key=f"{table}_search",
                                   placeholder="輸入關鍵字篩選...", label_visibility="collapsed")
        rows = db_query(f"SELECT * FROM [{table}] ORDER BY {key_field}")
        if search:
            rows = [r for r in rows if any(
                search.lower() in str(v).lower() for v in r.values() if v is not None
            )]
        with col_count:
            st.markdown(f"""
            <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:20px;
                        padding:6px 14px;text-align:center;font-size:13px;
                        color:#1d4ed8;font-weight:600;margin-top:4px;">
                共 {len(rows)} 筆
            </div>
            """, unsafe_allow_html=True)

        if rows:
            st.markdown(_table_html(fields, rows), unsafe_allow_html=True)
        else:
            st.info("無符合條件的資料")

    # ── 新增 ───────────────────────────────────────────────────────
    with tab_add:
        with st.form(f"{table}_add_form", clear_on_submit=True):
            st.markdown("**填寫新增資料**")
            values = {
                f["name"]: st.text_input(f["caption"], key=f"{table}_add_{f['name']}",
                                         placeholder=f"請輸入{f['caption']}")
                for f in fields
            }
            col1, _, _ = st.columns([1, 1, 3])
            with col1:
                submitted = st.form_submit_button("新增", type="primary", use_container_width=True)
            if submitted:
                if not values[key_field].strip():
                    st.error(f"「{fields[0]['caption']}」不可空白")
                else:
                    try:
                        cols_str = ", ".join(f["name"] for f in fields)
                        placeholders = ", ".join(["%s"] * len(fields))
                        db_exec(
                            f"INSERT INTO [{table}] ({cols_str}) VALUES ({placeholders})",
                            [values[f["name"]] for f in fields],
                        )
                        st.success("新增成功")
                    except Exception as e:
                        st.error(f"新增失敗：{e}")

    # ── 修改 ───────────────────────────────────────────────────────
    with tab_edit:
        rows_all = db_query(f"SELECT * FROM [{table}] ORDER BY {key_field}")
        codes = [r[key_field] for r in rows_all]
        if not codes:
            st.info("無資料可修改")
        else:
            selected = st.selectbox("選擇代碼", codes, key=f"{table}_edit_sel")
            rec = next((r for r in rows_all if r[key_field] == selected), {})
            with st.form(f"{table}_edit_form"):
                st.markdown("**修改資料**")
                values = {}
                for f in fields:
                    if f["name"] == key_field:
                        st.text_input(f["caption"], value=rec.get(f["name"], ""), disabled=True)
                        values[f["name"]] = rec.get(f["name"], "")
                    else:
                        values[f["name"]] = st.text_input(
                            f["caption"],
                            value=rec.get(f["name"], "") or "",
                            key=f"{table}_edit_{f['name']}",
                        )
                col1, _, _ = st.columns([1, 1, 3])
                with col1:
                    submitted = st.form_submit_button("儲存修改", type="primary", use_container_width=True)
                if submitted:
                    try:
                        set_clause = ", ".join(
                            f"{f['name']}=%s" for f in fields if f["name"] != key_field
                        )
                        params = [values[f["name"]] for f in fields if f["name"] != key_field]
                        params.append(rec[key_field])
                        db_exec(f"UPDATE [{table}] SET {set_clause} WHERE {key_field}=%s", params)
                        st.success("修改成功")
                    except Exception as e:
                        st.error(f"修改失敗：{e}")

    # ── 刪除 ───────────────────────────────────────────────────────
    with tab_del:
        rows_all2 = db_query(f"SELECT * FROM [{table}] ORDER BY {key_field}")
        codes2 = [r[key_field] for r in rows_all2]
        if not codes2:
            st.info("無資料可刪除")
        else:
            selected2 = st.selectbox("選擇代碼", codes2, key=f"{table}_del_sel")
            rec2 = next((r for r in rows_all2 if r[key_field] == selected2), {})

            st.markdown("**即將刪除以下資料：**")
            rows_html = "".join(
                f'<div style="display:flex;justify-content:space-between;padding:8px 0;'
                f'border-bottom:1px solid #fecaca;">'
                f'<span style="color:#6b7280;font-size:13px;">{f["caption"]}</span>'
                f'<span style="color:#191c1e;font-weight:600;font-size:13px;">'
                f'{rec2.get(f["name"], "")}</span></div>'
                for f in fields
            )
            st.markdown(f"""
            <div style="background:#fff5f5;border:1px solid #fecaca;
                        border-radius:10px;padding:16px;margin:12px 0;">
                {rows_html}
            </div>
            """, unsafe_allow_html=True)

            st.warning("刪除後無法復原，請確認！")
            if st.button("確定刪除", type="primary", key=f"{table}_del_btn"):
                try:
                    db_exec(f"DELETE FROM [{table}] WHERE {key_field}=%s", (selected2,))
                    st.success("刪除成功")
                    st.rerun()
                except Exception as e:
                    st.error(f"刪除失敗：{e}")
