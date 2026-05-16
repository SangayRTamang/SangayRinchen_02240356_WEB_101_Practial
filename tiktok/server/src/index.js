require('dotenv').config();  // line 1

const app = require('./app');

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT} in ${NODE_ENV} mode`);
});
