var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs340_tanakae',
  password        : '8041',
  database        : 'cs340_tanakae'
});
module.exports.pool = pool;
