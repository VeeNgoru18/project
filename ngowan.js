const Swal = require('sweetalert2');
var mysql = require('mysql');
var md5 = require('md5');
var jspdf = require('jspdf')
var jspdfAutotable = require('jspdf-autotable')

var categories = [];
var books = [];
var booksOnSale = [];
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'username',
  password: 'password',
  database: 'project'
});

// functions that run at startup
$(function () {
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
    for (var result of results) {
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
  doc.autoTable({ html: '#booksTable' });
  doc.save('table.pdf');
}

function AddCategory() {
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
  var idNO = $('#loginmodal #idNO').val();
  var password = $('#loginmodal #password').val();

  var query = `select * from users where idNO = '${idNO}' and password = '${md5(password)}' and active= '1'`;
  console.log(query);
  connection.query(query, function (error, results, fields) {
    if (error) throw error;
    if (results.length > 0) {

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
  var idNO = $('#NewUserModal #idNO').val();
  var password = $('#NewUserModal #password').val();
  var name = $('#NewUserModal #name').val();
  var userType = $('#NewUserModal #userType').val();


  if (!idNO.length || !password.length || !name.length || !userType){
    Swal.fire({
      title: 'Error!',
      text: 'You must fill all the User details',
      type: 'error',
      confirmButtonText: 'OK'
    })
  }
  else {
    var insertRegisterUserQuery = `insert into users values (NULL, '${name}', '${idNO}', '${md5(password)}', '${userType}')`;
    console.log(insertRegisterUserQuery);
    connection.query(insertRegisterUserQuery, function(error, results, fields){
      if (error) throw error;
      Swal.fire({
        title: 'success',
        text: 'User was added successfully!',
        type: 'success',
        confirmButtonText: 'OK'
      })
      $("NewUserModal input").val('')
      fetchUsers()
    });
  }

}

function fetchBooks() {
  var fetchBooksQuery = "select books.*, category.categoryName from books inner join category on category.categoryID = books.categoryID";

  connection.query(fetchBooksQuery, function (error, results, fields) {
    if (error) throw error;
    books = results;
    sessionStorage.setItem('books', JSON.stringify(books))
    $("#bookList").html('');

    for (var result of results) {
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


function AddBook() {
  var bookName = $('#bookName').val();
  var category = $('#bookCategory').val();
  var quantity = $('#quantity').val();
  var price = $('#price').val();
  var publisher = $('#publisher').val();



  if (!bookName.length || !category.length || !quantity.length || !price.length || !publisher.length) {
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
    connection.query(insertBookQuery, function (error, results, fields) {
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
  connection.query(editBookQuery, function (error, results, fields) {
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

  $("#SaveChangesEditBook").click(function () {
    var bookName = $('#EditBookName').val();
    var category = $('#EditBookCategory').val();
    var quantity = $('#EditQuantity').val();
    var price = $('#EditPrice').val();
    var publisher = $('#EditPublisher').val();



    if (!bookName.length || !category.length || !quantity || !price || !publisher.length) {
      Swal.fire({
        title: 'Error!',
        text: 'You must fill all the book details',
        type: 'error',
        confirmButtonText: 'Cool'
      })
    }
    else {
      var updateBookQuery = `update books set bookName='${bookName}', categoryID='${category}', quantity='${quantity}', price='${price}', publisher='${publisher}' where bookID='${bookID}'`

      connection.query(updateBookQuery, function (error, results, fields) {
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


// ----------- Sales --------------- //
function searchBook(searchText) {
  var books = JSON.parse(sessionStorage.getItem('books'));
  searchText = searchText.toLowerCase();
  var results = books.filter(b => b.bookName.toLowerCase().includes(searchText) || b.publisher.toLowerCase().includes(searchText) || b.categoryName.toLowerCase().includes(searchText))

  $("#searchBookSalesResults").html('')
  for (result of results) {
    result.qtty = 1;
    $("#searchBookSalesResults").append(`<li class="list-group-item" ><div class="row"><div class="col-sm-8">${result.bookName}, ${result.publisher} (${result.categoryName}) KES${result.price}</div><div class="col-sm-2"><input placeholder="qtty" id="bookqtty${result.bookID}" type="number" onkeyup="result.qtty = this.value"  value="${result.qtty}" min=1 " class="form-control" /></div><div class="col-sm-2"><input type="button" onclick="addBookToSales(result)" class="btn btn-info btn-sm" value="Add" /></div></div></li>`)
  }

}

function addBookToSales(result) {
  // Here, the result includes the information about the book and also qtty which is the number of books someone has chosen to sell
  // Adding the current book to the list of books on sales
  booksOnSale.push(result)
  $("#searchBookSalesInput").val('')
  $("#searchBookSalesResults").html('')
  // Here we get the user details from sessionStorage so that we use it in the sales db
  var userDetails = sessionStorage.getItem('user');
  var userID = JSON.parse(userDetails).userID;
  // here, make an insert query to sales table
  var insertQuery = `insert into sales values (NULL, ${result.bookID}, ${result.amount}, ${quantity},)`
  for (book of booksOnSale) {
    // for each loop, create a query for inserting a sales item
var insertBookToSales = `insert into salesitem values (NULL, ${result.bookID}, ${result.quantity})`;
    // eg `insert into salesitem values (NULL, ${result.bookID}, ${result.qtty})
  }


  // after you have added, close the modal
  $("#AddBookToSalesModal").val()
}
