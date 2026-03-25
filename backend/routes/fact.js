const express = require('express');
const router = express.Router();
const { sql, poolPromise } = require('../config/db');

router.get('/', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM fact ORDER BY fact_code');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const { fact_code, fact_name, fact_remark } = req.body;
  try {
    const pool = await poolPromise;
    await pool.request()
      .input('fact_code', sql.VarChar, fact_code)
      .input('fact_name', sql.VarChar, fact_name)
      .input('fact_remark', sql.VarChar, fact_remark)
      .query('INSERT INTO fact (fact_code, fact_name, fact_remark) VALUES (@fact_code, @fact_name, @fact_remark)');
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  const { fact_name, fact_remark } = req.body;
  try {
    const pool = await poolPromise;
    await pool.request()
      .input('fact_code', sql.VarChar, req.params.id)
      .input('fact_name', sql.VarChar, fact_name)
      .input('fact_remark', sql.VarChar, fact_remark)
      .query('UPDATE fact SET fact_name=@fact_name, fact_remark=@fact_remark WHERE fact_code=@fact_code');
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const pool = await poolPromise;
    await pool.request()
      .input('fact_code', sql.VarChar, req.params.id)
      .query('DELETE FROM fact WHERE fact_code=@fact_code');
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
