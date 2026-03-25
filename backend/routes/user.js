const express = require('express');
const router = express.Router();
const { sql, poolPromise } = require('../config/db');

router.get('/', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT userid, username, pwd FROM [user] ORDER BY userid');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const { userid, username, pwd } = req.body;
  try {
    const pool = await poolPromise;
    await pool.request()
      .input('userid', sql.VarChar, userid)
      .input('username', sql.VarChar, username)
      .input('pwd', sql.VarChar, pwd)
      .query('INSERT INTO [user] (userid, username, pwd) VALUES (@userid, @username, @pwd)');
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  const { username, pwd } = req.body;
  try {
    const pool = await poolPromise;
    await pool.request()
      .input('userid', sql.VarChar, req.params.id)
      .input('username', sql.VarChar, username)
      .input('pwd', sql.VarChar, pwd)
      .query('UPDATE [user] SET username=@username, pwd=@pwd WHERE userid=@userid');
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const pool = await poolPromise;
    await pool.request()
      .input('userid', sql.VarChar, req.params.id)
      .query('DELETE FROM [user] WHERE userid=@userid');
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
