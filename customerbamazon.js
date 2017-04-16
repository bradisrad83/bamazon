var inquirer = require("inquirer");
var mysql = require("mysql");
var Table = require("cli-table");
var productArray = [];
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "",
    database: "bamazonDB"
});
connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
});

// instantiate
var table = new Table({
    head: ["ID", "Prodcut Name", "Department", "Price", "Quantity in Stock"],
    colWidths: [5, 30, 20, 10, 20]
});
//Function to show TABLE
function showTable() {
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        //loop that goes through our product table and pushes the rows into the array table
        for (var i = 0; i < res.length; i++) {
            table.push(
                [res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]
            );
        }
        console.log(table.toString());
    });
}
//Function for prompting the seller for which product they would like to buy
function chooseProducts() {
    showTable();
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        inquirer.prompt([{
            type: "list",
            message: "Which item would you like to purchase?",
            choices: function() {
                for (var i = 0; i < res.length; i++) {
                    productArray.push("ID: " + res[i].item_id + " - " + res[i].product_name);
                }
                return productArray;
            },
            name: "input"
        }]).then(function(data) {
            for (var x = 0; x < res.length; x++) {

                switch (data.input) {
                    case productArray[x]:
                        buyProducts(res[x].stock_quantity, res[x].price, res[x].product_name);
                }
            }

        });
    });
}

//Function to actually buy/order the products
function buyProducts(quantity, cost, name) {
    //  console.log(product);
    //  console.log(quantity);
    //console.log(name);
    inquirer.prompt([{
        name: "number",
        message: "How many units would you like to purchase?"
    }]).then(function(answers) {
        //console.log(answers.number);
        checkout(answers.number, quantity, cost, name);
    });

}

//function to check to see if you can buy the units requested
function checkout(units, quantity, cost, name) {
    var total = units * cost;
    if (units < quantity) {
        console.log("Your total will be $ " + total);
        quantity = quantity - units;
        updateTable(name, quantity);
        inquirer.prompt([{
            type: "list",
            message: "Would you like to place another order?",
            choices: ["Yes", "No"],
            name: "input"
        }]).then(function(response) {
            if (response.input === "Yes") {
                chooseProducts();
            } else {
                connection.end(function() {
                    console.log("Thank you for shopping with us, please come back real soon");
                });
            }
        });
    } else {
        console.log("Not enough in stock");
        inquirer.prompt([{
            type: "list",
            message: "Would you like to try again?",
            choices: ["Yes", "No"],
            name: "input"
        }]).then(function(response) {
            if (response.input === "Yes") {
                buyProducts();
            } else {
                connection.end(function() {
                    console.log("We are sorry we could not meet your demand.  Please check back with us soon for updated quantities");
                });

            }
        })

    }
}

//Function to update the quantity after checkout and redraw the table
function updateTable(name, quantity) {
    connection.query("UPDATE products SET? WHERE?", [{
        stock_quantity: quantity
    }, {
        product_name: name
    }], function(err, res) {});
}
chooseProducts();
