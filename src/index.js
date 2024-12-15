const express = require('express');
const cors = require('cors')
const Connection = require('./db/Connection');
const router = require('./routes/web')
const app = express();
const port = 3001;
require('dotenv').config();


app.use(express.json());
app.use(cors({
  credentials:true,
    origin: [
    'http://localhost:3000', // for local development
    'https://guitar-shop-frontend-brown.vercel.app' //frontend URL
  ]
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(router);

new Connection()

app.get('/',(req,res)=>{
    res.send('hello to china electronics server')
})

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})