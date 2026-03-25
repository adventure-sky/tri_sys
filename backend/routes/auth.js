const express = require('express');
const router = express.Router();
const { sql, poolPromise } = require('../config/db');

router.post('/login', async (req, res) => {
  const { userid, pwd } = req.body;
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('userid', sql.VarChar, userid)
      .input('pwd', sql.VarChar, pwd)
      .query('SELECT userid, username FROM [user] WHERE userid = @userid AND pwd = @pwd');

    if (result.recordset.length > 0) {
      res.json({ success: true, user: result.recordset[0] });
    } else {
      res.status(401).json({ success: false, message: '用戶名稱或密碼錯誤' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
