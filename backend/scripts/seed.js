require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const sql = require('mssql');

const config = {
  server: process.env.DB_SERVER,
  port: parseInt(process.env.DB_PORT),
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

const pad = (n) => String(n).padStart(3, '0');

async function seed() {
  let pool;
  try {
    pool = await sql.connect(config);
    console.log('Connected to SQL Server');

    // ── 建立資料表 ──────────────────────────────────────────────

    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='cust' AND xtype='U')
      CREATE TABLE cust (
        cust_code  VARCHAR(20)  NOT NULL PRIMARY KEY,
        cust_name  NVARCHAR(100),
        cust_remark NVARCHAR(200)
      )
    `);
    console.log('Table cust OK');

    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='fact' AND xtype='U')
      CREATE TABLE fact (
        fact_code  VARCHAR(20)  NOT NULL PRIMARY KEY,
        fact_name  NVARCHAR(100),
        fact_remark NVARCHAR(200)
      )
    `);
    console.log('Table fact OK');

    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='item' AND xtype='U')
      CREATE TABLE item (
        item_code  VARCHAR(20)  NOT NULL PRIMARY KEY,
        item_name  NVARCHAR(100),
        item_remark NVARCHAR(200)
      )
    `);
    console.log('Table item OK');

    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='user' AND xtype='U')
      CREATE TABLE [user] (
        userid   VARCHAR(20)  NOT NULL PRIMARY KEY,
        username NVARCHAR(100),
        pwd      VARCHAR(50)
      )
    `);
    console.log('Table [user] OK');

    // ── 清除舊資料 ──────────────────────────────────────────────

    await pool.request().query('DELETE FROM cust');
    await pool.request().query('DELETE FROM fact');
    await pool.request().query('DELETE FROM item');
    await pool.request().query('DELETE FROM [user]');
    console.log('Cleared existing data');

    // ── 插入測試資料 ────────────────────────────────────────────

    // cust: C001 ~ C050
    for (let i = 1; i <= 50; i++) {
      const code = `C${pad(i)}`;
      await pool.request()
        .input('c', sql.VarChar, code)
        .input('n', sql.NVarChar, `客戶名稱${pad(i)}`)
        .input('r', sql.NVarChar, `客戶備註${pad(i)}`)
        .query('INSERT INTO cust VALUES (@c, @n, @r)');
    }
    console.log('Inserted 50 rows → cust');

    // fact: F001 ~ F050
    for (let i = 1; i <= 50; i++) {
      const code = `F${pad(i)}`;
      await pool.request()
        .input('c', sql.VarChar, code)
        .input('n', sql.NVarChar, `廠商名稱${pad(i)}`)
        .input('r', sql.NVarChar, `廠商備註${pad(i)}`)
        .query('INSERT INTO fact VALUES (@c, @n, @r)');
    }
    console.log('Inserted 50 rows → fact');

    // item: I001 ~ I050
    for (let i = 1; i <= 50; i++) {
      const code = `I${pad(i)}`;
      await pool.request()
        .input('c', sql.VarChar, code)
        .input('n', sql.NVarChar, `商品名稱${pad(i)}`)
        .input('r', sql.NVarChar, `商品備註${pad(i)}`)
        .query('INSERT INTO item VALUES (@c, @n, @r)');
    }
    console.log('Inserted 50 rows → item');

    // user: U001 ~ U050
    for (let i = 1; i <= 50; i++) {
      const code = `U${pad(i)}`;
      await pool.request()
        .input('c', sql.VarChar, code)
        .input('n', sql.NVarChar, `用戶名稱${pad(i)}`)
        .input('p', sql.VarChar, '123456')
        .query('INSERT INTO [user] VALUES (@c, @n, @p)');
    }
    console.log('Inserted 50 rows → [user]');

    console.log('\nDone! All tables created and seeded.');
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    if (pool) await pool.close();
  }
}

seed();
