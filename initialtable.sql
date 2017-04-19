CREATE DATABASE bamazonDB;

USE bamazonDB;

CREATE TABLE products(
  item_id INTEGER(100) NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(100) NOT NULL,
  department_name VARCHAR(50) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  stock_quantity INTEGER(5) NOT NULL,
  PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Fidget Cube", "Household Items", 9.99, 1000);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("3 Pack Tennis Balls", "Sporting Goods", 4.99, 200);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Laptop Sleeve", "Computers", 15.99, 50);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Aviator Sunglasses", "Personal Items", 10.99, 300);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("5 Pack White Socks", "Clothing", 7.99, 100);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Flip Flops", "Shoes", 3.99, 500);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("BBQ Rub", "Outdoor", 12.99, 75);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("RC Car", "Hobbies", 34.99, 30);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Dog Squeak Toy", "Pets", 8.99, 80);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Android TV Box", "Electronics", 59.99, 25);


CREATE TABLE departments(
  department_id INTEGER(100) NOT NULL AUTO_INCREMENT,
  department_name VARCHAR(50) NOT NULL,
  over_head_cost DECIMAL(10, 2) NOT NULL,
  total_sales DECIMAL(10, 2) NOT NULL,
  PRIMARY KEY (department_id)
);
