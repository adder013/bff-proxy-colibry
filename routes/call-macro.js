const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/", (req, res) => {
  const token = req.session.token // Получаем токен из текущей сессии
  if (token) {
    const macroName = req.query.macro
    if(!macroName) {
      res.statusCode = 400;
      res.send('Не указано имя макроса')
    }
    axios.get(`${process.env.AUTH_URL}/webapi/do`, {
      params: { 
        macro: macroName
      },
      headers: { // Необходимо добавить авторизационный заголовок, который содержит токен
        Authorization: `Bearer ${token}`
      }
    }).then((result) => {
      let responseData = result.data;
      if (responseData) {
        res.send(responseData);
      }
      else {
        req.session.destroy(); // Если ничего не вернулось, удалим сессию
        res.send({
          authState: "notAuthenticated" // И ответим, что пользователь не аутентифицирован
        });
      }
    }).catch((err) => {
      res.statusCode = 500;
      res.send(err)
    })
  }
  else { // Если токена нет, значит пользователь не аутентифицирован
    res.send({
      authState: "notAuthenticated"
    });
  }
});
module.exports = router;
