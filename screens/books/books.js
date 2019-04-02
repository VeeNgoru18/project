// todo - escape quotes

const Swal = require('sweetalert2');

var mysql      = require('mysql');
var categories = [];
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'username',
  password : 'password',
  database : 'project'
});

$(function() {
  fetchCategories();
})

function fetchCategories() {
  var fetchCategoriesQuery = "select * from category";

  connection.query(fetchCategoriesQuery, function (error, results, fields) {
    if (error) throw error;
    categories = results;
    $("#categoryParent").html('<option value="0" selected>-no parent-</option>')
    for (var result of results){
      $("#categoryParent").append($('<option>', {
        value: result.categoryID,
        text: result.categoryName
      }))
    }

  });

}

function AddCategory(){
  var categoryLevel = 1;
  var categoryName = $('#categoryName').val();
  var categoryParent = $('#categoryParent').val();
  if (categoryParent != 0) {
    var selectedCategory = categories.find(x => x.categoryID == categoryParent);
    categoryLevel = selectedCategory.level + 1
  }

  if (categoryName.length == 0 || categoryLevel.length == 0) {
    Swal.fire({
      title: 'Error!',
      text: 'You must fill the whole form',
      type: 'error',
      confirmButtonText: 'Cool'
    })
  } else {
    var insertQuery = `insert into category values (NULL, '${categoryName}', '${categoryLevel}', '${categoryParent}')`;
    console.log(insertQuery)
    connection.query(insertQuery, function (error, results, fields) {
      if (error) throw error;
      alert('Category was added successfully');
      fetchCategories()
    });

  }

}
