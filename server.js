const express = require("express"); // Фреймворк Express JS
const cors = require("cors");// Пакет для настройки CORS
const session = require("express-session") // Пакет для создания и управления сессиями
/*
  В примере, все настройки для OAuth хранятся в .env файле для удобства.
  С помощью пакета dotenv мы будем получать их из .env файла.
*/
const path = require('path')
// require('dotenv').config({ path: path.resolve(__dirname, './.env') })
require('dotenv').config({ path: path.resolve(__dirname, './.env') }) // Получаем .env файл из корневой папки
const app = express();
/*
  Включаем CORS и задаем ему параметры:
*/

app.use(cors({ 
  origin: ['http://localhost:8080','https://custom-colibri-web.netlify.app'], // URL с которого можно принимать кроссдоменные запросы. Здесь должен быть URL нашего стороннего веб приложения
  credentials: true // Добавить заголовок Access-Control-Allow-Credentials
}));

//app.set('​trust proxy​', 1) // Считаем защищенным первый прокси сервер (именно первый по счету по пути от сервера до клиента)
app.use(express.json());
app.use(session(
  {
    secret: '22a6da6e-8b35-4edf-b85d-88e44dd589d2', // Секрет, который используется для подписания куки sessionID
    resave: false, // Выключаем принудительное пересохранение сессии во время запроса, если сессия не изменилась
    saveUninitialized: false, // Выключаем сохранение не инициализированной сессии
    proxy: true, // Сообщаем, что доверяем прокси серверу. Будет отправляться заголовок X-Forwarded-Proto
    cookie: {
      sameSite: 'none', // Устанавливаем заголовку SameSite значение None
      secure: true, // Добавляем куку Secure
      httpOnly: true, // Добавляем куку HttpOnly
      maxAge: 3600000 // Устанавливаем время жизни сессии в миллисекундах
    }
  })
);

const port =process.env.PORT || 8000; // Устанавливаем дефолтный порт
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

app.get("/", (req, res) => {
  res.send({
    message: "Пример аутентификации в Колибри через OAuth2"
  });
});

// Подключаем роуты
app.use('/user', require('./routes/user'))
app.use('/login', require('./routes/login'))
app.use('/logout', require('./routes/logout'))
app.use('/call-macro', require('./routes/call-macro'))
app.use('/oauth-callback', require('./routes/oauth-callback'))