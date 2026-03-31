import streamlit as st
from db import db_query, db_exec


def maint_page(title, table, key_field, fields):
    """Generic CRUD maintenance page."""
    st.subheader(title)
    if st.button("← 返回主選單", key=f"{table}_back"):
        st.session_state.page = "menu"
        st.rerun()

    tab_list, tab_add, tab_edit, tab_del = st.tabs(["查詢列表", "新增", "修改", "刪除"])

    # ── 查詢列表 ──────────────────────────────────────────────────
    with tab_list:
        search = st.text_input("搜尋", key=f"{table}_search")
        rows = db_query(f"SELECT * FROM [{table}] ORDER BY {key_field}")
        if search:
            rows = [r for r in rows if any(
                search.lower() in str(v).lower() for v in r.values() if v is not None
            )]
        if rows:
            st.dataframe(rows, use_container_width=True, hide_index=True)
            st.caption(f"共 {len(rows)} 筆")
        else:
            st.info("無資料")

    # ── 新增 ───────────────────────────────────────────────────────
    with tab_add:
        with st.form(f"{table}_add_form", clear_on_submit=True):
            values = {f["name"]: st.text_input(f["caption"], key=f"{table}_add_{f['name']}") for f in fields}
            if st.form_submit_button("新增"):
                if not values[key_field].strip():
                    st.error(f"{fields[0]['caption']} 不可空白")
                else:
                    try:
                        cols = ", ".join(f["name"] for f in fields)
                        placeholders = ", ".join(["%s"] * len(fields))
                        db_exec(
                            f"INSERT INTO [{table}] ({cols}) VALUES ({placeholders})",
                            [values[f["name"]] for f in fields]
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
                values = {}
                for f in fields:
                    if f["name"] == key_field:
                        st.text_input(f["caption"], value=rec.get(f["name"], ""), disabled=True)
                        values[f["name"]] = rec.get(f["name"], "")
                    else:
                        values[f["name"]] = st.text_input(f["caption"], value=rec.get(f["name"], "") or "")
                if st.form_submit_button("儲存修改"):
                    try:
                        set_clause = ", ".join(
                            f"{f['name']}=%s" for f in fields if f["name"] != key_field
                        )
                        params = [values[f["name"]] for f in fields if f["name"] != key_field]
                        params.append(rec[key_field])
                        db_exec(f"UPDATE [{table}] SET {set_clause} WHERE {key_field}=?", params)
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
            st.write("**即將刪除以下資料：**")
            st.json(rec2)
            if st.button("確定刪除", type="primary", key=f"{table}_del_btn"):
                try:
                    db_exec(f"DELETE FROM [{table}] WHERE {key_field}=%s", (selected2,))
                    st.success("刪除成功")
                    st.rerun()
                except Exception as e:
                    st.error(f"刪除失敗：{e}")
