import pymssql
import streamlit as st


def get_conn():
    s = st.secrets["db"]
    return pymssql.connect(
        server=s['server'],
        port=int(s['port']),
        database=s['database'],
        user=s['user'],
        password=s['password'],
    )


def db_query(sql, params=()):
    conn = get_conn()
    cur = conn.cursor(as_dict=True)
    cur.execute(sql, params)
    rows = cur.fetchall()
    conn.close()
    return rows


def db_exec(sql, params=()):
    conn = get_conn()
    cur = conn.cursor()
    cur.execute(sql, params)
    conn.commit()
    conn.close()
