const express = require("express");
const router = express.Router();
const axios = require("axios").default;
const qs = require("query-string");

const config = {
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
};
const url = `${process.env.AUTH_URL}/connect/token`;

router.get("/", (req, res) => {
  /*
    Получим stateValue с сервера и проверим, что бы он совпадал с тем, что мы посылали в login.js
  */
  const stateFromServer = req.query.state;
  if (stateFromServer !== req.session.stateValue) {
    console.log("stateValue doesn't match");
    console.log(`Current: ${stateFromServer}, but expected: ${req.session.stateValue}`);
    res.redirect(302, '/');
    return;
  }
  /*
    Если все в порядке, отправим запрос на получение токена
  */
  axios.post(url, qs.stringify({
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      code: req.query.code,
      grant_type: "authorization_code",
      redirect_uri: process.env.REDIRECT_URI,
    }),
    config
  ).then((result) => {
    req.session.token = result.data.access_token;
      // Сохраним токен в сессию
    console.log('asd')
    res.redirect(`http://localhost:8080`); // Редиректим пользователя обратно в наше веб приложение
  }).catch((err) => {
    console.error(err);
  });
});
module.exports = router;