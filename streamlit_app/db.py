import pyodbc
import streamlit as st


def get_conn():
    s = st.secrets["db"]
    conn_str = (
        "DRIVER={ODBC Driver 17 for SQL Server};"
        f"SERVER={s['server']},{s['port']};"
        f"DATABASE={s['database']};"
        f"UID={s['user']};"
        f"PWD={s['password']};"
        "TrustServerCertificate=yes;"
    )
    return pyodbc.connect(conn_str)


def db_query(sql, params=()):
    conn = get_conn()
    cur = conn.cursor()
    cur.execute(sql, params)
    cols = [d[0] for d in cur.description]
    rows = [dict(zip(cols, row)) for row in cur.fetchall()]
    conn.close()
    return rows


def db_exec(sql, params=()):
    conn = get_conn()
    cur = conn.cursor()
    cur.execute(sql, params)
    conn.commit()
    conn.close()
