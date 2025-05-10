const {Pool} = require('pg');

const db = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'tournament_db',
  password: 'laddan123',
  port: 5433,
});

db.connect()
.then(() => {
    console.log('Connected to postgres database')
})
.catch(err => {
    console.log("Error connecting to postgres database:", err)
})


module.exports = db