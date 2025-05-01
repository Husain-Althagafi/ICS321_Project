//Imports
const express = require('express')
const cors = require('cors')
const authRoutes = require('./routes/authRoutes')
const adminRoutes = require('./routes/adminRoutes')
// const guestRoutes = require('./routes/guestRoutes')


//App
const app = express()
const PORT = 5000
const DB_PORT = 5432


//Middleware
app.use(express.json())
app.use(cors())


//Routes
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
// app.use('/guest', guestRoutes);


//Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });