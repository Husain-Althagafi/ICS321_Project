//Imports
const express = require('express')
const cors = require('cors')

//Routes
const authRoutes = require('./routes/authRoutes')
const adminRoutes = require('./routes/adminRoutes')
const guestRoutes = require('./routes/guestRoutes')


//App
const app = express()
const PORT = 5000

//Middleware
app.use(cors())
app.use(express.json())

//Routes
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/guest', guestRoutes);


//Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });