//Environment variables
require('dotenv').config()
dotenv.config();


//Imports
const express = require('express')
const cors = require('cors')


//App
const app = express()
const PORT = process.env.PORT


//Middleware
app.use(express.json())
app.use(cors)


//Routes



//Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });