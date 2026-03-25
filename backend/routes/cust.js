const express = require('express');
const router = express.Router();
const { sql, poolPromise } = require('../config/db');

router.get('/', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM cust ORDER BY cust_code');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const { cust_code, cust_name, cust_remark } = req.body;
  try {
    const pool = await poolPromise;
    await pool.request()
      .input('cust_code', sql.VarChar, cust_code)
      .input('cust_name', sql.VarChar, cust_name)
      .input('cust_remark', sql.VarChar, cust_remark)
      .query('INSERT INTO cust (cust_code, cust_name, cust_remark) VALUES (@cust_code, @cust_name, @cust_remark)');
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  const { cust_name, cust_remark } = req.body;
  try {
    const pool = await poolPromise;
    await pool.request()
      .input('cust_code', sql.VarChar, req.params.id)
      .input('cust_name', sql.VarChar, cust_name)
      .input('cust_remark', sql.VarChar, cust_remark)
      .query('UPDATE cust SET cust_name=@cust_name, cust_remark=@cust_remark WHERE cust_code=@cust_code');
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const pool = await poolPromise;
    await pool.request()
      .input('cust_code', sql.VarChar, req.params.id)
      .query('DELETE FROM cust WHERE cust_code=@cust_code');
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
