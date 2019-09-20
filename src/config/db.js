var Mysql = require('node-mysql-promise');
var db = Mysql.createConnection({
    host        : 'localhost',
    user        : 'root',
    password    : 'root',
    database    : 'chat',
    //logSql      : true,
    tablePrefix : 'pre_'
});

module.exports = db;