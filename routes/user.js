const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/", (req, res) => {
  console.log("asd2",req.session.token)
  if (req.session.token) {
    axios.get(`${process.env.AUTH_URL}/connect/userinfo`, { 
      headers: {  // Необходимо добавить авторизационный заголовок, который содержит токен
        Authorization: `Bearer ${req.session.token}` 
      } 
    }).then((result) => {
      let userInfoResponse = result.data;
      if (userInfoResponse) {
        res.send({
          authState: "Authorized",
          userInfoResponse: userInfoResponse,
        });
      }
      else {// Если данных нет - очистим сессию и вернем стаус "не авторизован"
        req.session.destroy();
        res.send({
          authState: "notAuthenticated"
        });
      }
    })
    .catch((err) => {
      console.log(err.request);
      res.send({
        authState: "notAuthenticated"
      });
    });
  }
  // Если токена нет, значит пользователь точно не авторизован
  else {
    res.send({
      authState: "notAuthenticated"
    });
  }
});
module.exports = router;
