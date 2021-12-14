const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {

  /*
    Сгенерируем хэш строку, чтобы использовать её в качестве stateValue
  */
  const stateValue = Math.random().toString(36).substring(2, 15) + 
    Math.random().toString(36).substring(2, 15) + 
    Math.random().toString(36).substring(2, 15) + 
    Math.random().toString(36).substring(2, 15) + 
    Math.random().toString(36).substring(2, 15) + 
    Math.random().toString(36).substring(2, 15);
  
  req.session.stateValue = stateValue

  /*
    Отправим пользователя на страницу авторизации
  */
  const redirectEncoded=encodeURIComponent(process.env.REDIRECT_URI)
  res.redirect(`${process.env.AUTH_URL}/connect/authorize?client_id=${process.env.CLIENT_ID}&redirect_uri=${redirectEncoded}&response_type=code&state=${stateValue}`);
});
module.exports = router;