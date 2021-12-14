const express = require('express');
const router = express.Router();
router.get('/', (req, res) => {
  req.session.destroy(); // Удалим сессию
  res.redirect(`${process.env.AUTH_URL}/signout`); // И выйдем из Колибри
});
module.exports = router;