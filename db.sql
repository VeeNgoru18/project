-- database structure
create table category (
  categoryID int primary key auto_increment,
  categoryName varchar(250),
  level int (11) default 1,
  parent int (11) default 0
);

create table books (
  bookID int primary key auto_increment,
  bookName varchar(250),
  categoryID int,
  quantity int (11),
  `price` double default 0.0,
  publisher varchar(250),

  foreign key (categoryID) references category(categoryID)
);

create table users (
  userID int primary key auto_increment,
  userType varchar(250),
  password varchar(250),
  `name` varchar(250),
  idNO varchar(32) unique,
  active boolean default '1'
);

create table sales (
  salesID int primary key auto_increment,
  bookID int,
  userID int,
  customerContact varchar(250),
  customerName varchar(250),
  dateBookBought TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  quantity int,
  amount double default 0.0
);

ALTER TABLE `sales`
ADD CONSTRAINT `fk_sales_bookID` FOREIGN KEY (`bookID`)
REFERENCES `books`(`bookID`)
ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE `sales`
ADD CONSTRAINT `fk_sales_userID` FOREIGN KEY (`userID`)
REFERENCES `users`(`userID`)
ON DELETE RESTRICT ON UPDATE RESTRICT;
