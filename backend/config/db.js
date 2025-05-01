const {Pool} = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'tournament_db',
  password: 'qvcfG13@@@',
  port: 5432,
});

pool.connect()
.then(() => {
    console.log('Connected to postgres database')
})
.catch(err => {
    console.log("Error connecting to postgres database:", err)
})


module.exports = pool