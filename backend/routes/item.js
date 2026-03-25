const express = require('express');
const router = express.Router();
const { sql, poolPromise } = require('../config/db');

router.get('/', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM item ORDER BY item_code');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const { item_code, item_name, item_remark } = req.body;
  try {
    const pool = await poolPromise;
    await pool.request()
      .input('item_code', sql.VarChar, item_code)
      .input('item_name', sql.VarChar, item_name)
      .input('item_remark', sql.VarChar, item_remark)
      .query('INSERT INTO item (item_code, item_name, item_remark) VALUES (@item_code, @item_name, @item_remark)');
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  const { item_name, item_remark } = req.body;
  try {
    const pool = await poolPromise;
    await pool.request()
      .input('item_code', sql.VarChar, req.params.id)
      .input('item_name', sql.VarChar, item_name)
      .input('item_remark', sql.VarChar, item_remark)
      .query('UPDATE item SET item_name=@item_name, item_remark=@item_remark WHERE item_code=@item_code');
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const pool = await poolPromise;
    await pool.request()
      .input('item_code', sql.VarChar, req.params.id)
      .query('DELETE FROM item WHERE item_code=@item_code');
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
