const cors = require('cors');

const allowedCors = cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
  ],
  credentials: true,
});
module.exports = { allowedCors };
