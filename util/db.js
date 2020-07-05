const Sequelize = require('sequelize');

const sequelize = new Sequelize("node-complete", "root", "siva", {
  dialect: "mysql",
  host: "localhost"
})

// const mysql = require('mysql2')

// const pool = mysql.createPool({
//   host: "localhost",
//   user: "root",
//   database: 'node-complete',
//   password: "siva"
// })

// module.exports = pool.promise();
module.exports = sequelize;