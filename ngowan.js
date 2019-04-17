// todo - escape quotes
const Swal = require('sweetalert2');
var mysql      = require('mysql');
var md5 = require('md5');
var jspdf = require('jspdf')
var jspdfAutotable = require('jspdf-autotable')

var categories = [];
var books = [];
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'username',
  password : 'password',
  database : 'project'
});

// functions that run at startup
$(function() {
  // $("#bookCategory").select2()
  fetchCategories();
  fetchBooks();

})

// -- Books screen--

function fetchCategories() {
  var fetchCategoriesQuery = "select * from category";

  connection.query(fetchCategoriesQuery, function (error, results, fields) {
    if (error) throw error;
    categories = results;
    $("#categoryParent").html('<option value="0" selected>-no parent-</option>')
    $("#bookCategory").html('')
    $("#EditBookCategory").html('')
    for (var result of results){
      $("#categoryParent, #bookCategory, #EditBookCategory").append($('<option>', { //used to insert specified content
        value: result.categoryID,
        text: result.categoryName
      }))
    }

  });

}


function downloadBooks() {
  var doc = new jspdf();
    // You can use html:
    doc.autoTable({html: '#booksTable'});
    doc.save('table.pdf');
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
  }
  else {
    var insertQuery = `insert into category values (NULL, '${categoryName}', '${categoryLevel}', '${categoryParent}')`;
    console.log(insertQuery)
    connection.query(insertQuery, function (error, results, fields) {
      if (error) throw error;
      alert('Category was added successfully');
      fetchCategories()
    });

  }

}


// -- Authentication ---
function login() {
  var idNO = $('#idNO').val();
  var password = $('#password').val();

var query = `select * from users where idNO = '${idNO}' and name = '${name}' and password = '${md5(password)}' and active= '1'`
connection.query(query, function (error, results, fields) {
  if (error) throw error;
  if (results.length > 0){

    sessionStorage.setItem('user', JSON.stringify(results[0]))
    $('#loginmodal').modal('hide');
  }
  else {
    Swal.fire({
      title: 'Error!',
      text: 'Wrong Credentials',
      type: 'error',
      confirmButtonText: 'OK'
    })
  }
})

}
// add new user
function registerUser() {
  var idNO = $('#idNO').val();
  var password = $('#password').val();

  var insertRegisterQuery = `insert into users values (NULL, '${userType}', '${md5(password)}', ${active}) `;
}
//sales screen
 //function Addsales(){
  //var sales;
  //var customerName = $('#customerName').val();
  //var salesDate = $('#salesDate').val();
  //var customerContact = $('#customerContact').val();

  //var query = `insert into sales values (NULL, '${sales}'`

//}

function fetchBooks(){
  var fetchBooksQuery = "select books.*, category.categoryName from books inner join category on category.categoryID = books.categoryID";

  connection.query(fetchBooksQuery, function (error, results, fields){
    if (error) throw error;
    books = results;
    $("#bookList").html('');
    for (var result of results){
      var tr = $('<tr>');

      tr.append($('<td>', {
        text: result.bookID
      }))

      tr.append($('<td>', {
        text: result.bookName
      }))

      tr.append($('<td>', {
        text: result.categoryName
      }))

      tr.append($('<td>', {
        text: result.quantity
      }))

      tr.append($('<td>', {
        text: result.publisher
      }))

      tr.append($('<td>', {
        text: result.price
      }))

      tr.append($('<td>').html('<button class="btn btn-sm btn-success btn-fluid" onclick="EditBook(' + result.bookID + ')">Edit</button>'))



      $("#bookList").append(tr)

    }

  })
}


function AddBook(){
  var bookName = $('#bookName').val();
  var category = $('#bookCategory').val();
  var quantity = $('#quantity').val();
  var price = $('#price').val();
  var publisher = $('#publisher').val();



if (!bookName.length  || !category.length  || !quantity || !price || !publisher.length){
  Swal.fire({
    title: 'Error!',
    text: 'You must fill all the book details',
    type: 'error',
    confirmButtonText: 'Cool'
  })
}
else {
  var insertBookQuery = `insert into books values (NULL, '${bookName}', '${category}', '${quantity}', '${price}', '${publisher}')`;
  console.log(insertBookQuery);
  connection.query(insertBookQuery, function(error, results, fields){
    if (error) throw error;
    Swal.fire({
      title: 'success',
      text: 'Book added successfully!',
      type: 'success',
      confirmButtonText: 'OK'
    })
    $("#NewBookModal input").val('')
    fetchBooks()
  });
}
}

function EditBook(bookID) {
  // 1. get that book from the db
  //2. fill the form with the book details
  // 3. update the book in the db
  var editBookQuery = `select * from books where bookID = '${bookID}' `
  connection.query(editBookQuery, function(error, results, fields) {
    if (error) throw error;
    console.log(results);
    book = results[0]
    $("#EditBookName").val(book.bookName)
    $("#EditPrice").val(book.price)
    $("#EditPublisher").val(book.publisher)
    $("#EditQuantity").val(book.quantity)
    $("#EditBookCategory").val(book.categoryID)
    $("#EditBookModal").modal('show')
  })

  $("#SaveChangesEditBook").click(function() {
    var bookName = $('#EditBookName').val();
    var category = $('#EditBookCategory').val();
    var quantity = $('#EditQuantity').val();
    var price = $('#EditPrice').val();
    var publisher = $('#EditPublisher').val();



  if (!bookName.length  || !category.length  || !quantity || !price || !publisher.length){
    Swal.fire({
      title: 'Error!',
      text: 'You must fill all the book details',
      type: 'error',
      confirmButtonText: 'Cool'
    })
  }
  else {
    var updateBookQuery = `update books set bookName='${bookName}', categoryID='${category}', quantity='${quantity}', price='${price}', publisher='${publisher}' where bookID='${bookID}'`

    connection.query(updateBookQuery, function(error, results, fields){
      if (error) throw error;
      Swal.fire({
        title: 'success',
        text: 'Book updated successfully!',
        type: 'success',
        confirmButtonText: 'OK'
      })

      fetchBooks()
    });
  }
  })

}
