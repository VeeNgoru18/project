var mysql = require('mysql');

var connection = mysql.createConnection({
  host:'localhost',
  user: 'username',
  password: 'password',
  database: 'project'
});



function getCategories() {
  connection.connect();
  connection.query('SELECT * FROM `category`', function (error, results, fields) {
    if (error) throw error;
    console.log('The solution is: ', results);
  });
  connection.end();
}

function gc() {
  connection.connect()
  return connection.query('SELECT * FROM category')
}

var gc_call = gc();
console.log(gc_call)

function getBooks() {
  connection.connect();
  connection.query('SELECT * FROM `books`', function(error, results, fields){
    if (error) throw error;
    console.log('The solution is:', results);
  });
  connection.end();
}