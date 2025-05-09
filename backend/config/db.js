const {Pool} = require('pg');

const db = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'tournaments_db_almaan',
  password: 'qvcfG13@@@',
  port: 5432,
});

db.connect()
.then(() => {
    console.log('Connected to postgres database')
})
.catch(err => {
    console.log("Error connecting to postgres database:", err)
})


module.exports = db