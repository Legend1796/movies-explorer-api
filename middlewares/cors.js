const cors = require('cors');

const allowedCors = cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://api.nomoreparties.co/beatfilm-movies/movies',
    'https://movies.legend1796.nomoredomains.icu',
  ],
  credentials: true,
});
module.exports = { allowedCors };
