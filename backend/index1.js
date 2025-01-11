const connectDB = require('./db');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

connectDB();

const express = require('express')
const app = express()
const port = 5000;

app.use(express.json());
//available routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})