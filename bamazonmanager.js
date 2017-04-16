var inquirer = require("inquirer");
var mysql = require("mysql");
var Table = require("cli-table");
var productArray = [];
var quantity;
var table = new Table({
    head: ["ID", "Prodcut Name", "Department", "Price", "Quantity in Stock"],
    colWidths: [5, 30, 20, 10, 20]
});
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

function start() {
    inquirer.prompt([{
        type: "list",
        message: "Please choose on of the following",
        choices: ["View Products for Sale",
            "View Low Inventory",
            "Add to Inventory",
            "Add New Product"
        ],
        name: "input"
    }]).then(function(userchoice) {
        switch (userchoice.input) {
            case "View Products for Sale":
                buildTable();
                break;
            case "View Low Inventory":
                showLowInventory();
                break;
            case "Add to Inventory":
                updateInventory();
                break;
            case "Add New Product":
                addProduct();
                break;
        }
    });
}

function buildTable() {
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        //loop that goes through our product table and pushes the rows into the array table
        for (var i = 0; i < res.length; i++) {
            table.push(
                [res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]
            );
        }
        console.log(table.toString());
        inquirer.prompt([{
            type: "list",
            message: "Would you like to do more?",
            choices: ["Yes", "No"],
            name: "input"
        }]).then(function(response) {
            if (response.input === "Yes") {
                start();
            } else {
                connection.end(function() {
                    console.log("Please log back on soon to keep up with the demand.");
                });

            }
        });
    });
}

function showLowInventory() {
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        var count = 0;
        for (i = 0; i < res.length; i++) {
            if (res[i].stock_quantity < 6) {
                console.log("You currently have "+ res[i].stock_quantity+" "+res[i].product_name+" in stock.");
                count++;
            }
        }
        if (count === 0) {
            console.log("We are not low on any of our inventory.")
        }
        inquirer.prompt([{
            type: "list",
            message: "Would you like to do more?",
            choices: ["Yes", "No"],
            name: "input"
        }]).then(function(response) {
            if (response.input === "Yes") {
                start();
            } else {
                connection.end(function() {
                    console.log("Please log back on soon to keep up with the demand.");
                });

            }
        });
    });
}

function updateInventory() {
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        inquirer.prompt([{
            type: "list",
            message: "Which item would you like to restock?",
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
                        update(res[x]);
                }
            }
        })
    });
}

function update(data) {
    inquirer.prompt([{
        name: "number",
        message: "How many units would you like to add?"
    }]).then(function(newTotal) {
        quantity = parseInt(data.stock_quantity) + parseInt(newTotal.number);
        connection.query("UPDATE products SET ? WHERE ?", [{
                stock_quantity: quantity
            }, {
                product_name: data.product_name
            }],
            function(err, res) {});
    });

    inquirer.prompt([{
        type: "list",
        message: "Would you like to do more?",
        choices: ["Yes", "No"],
        name: "input"
    }]).then(function(response) {
        if (response.input === "Yes") {
            start();
        } else {
            connection.end(function() {
                console.log("Please log back on soon to keep up with the demand.");
            });

        }
    });
}

function addProduct() {
    inquirer.prompt([{
        name: "product_name",
        message: "What is the name of the product you would like to add?"
    }, {
        name: "department_name",
        message: "What department should it be placed in?"
    }, {
        name: "price",
        message: "What will it cost?"
    }, {
        name: "stock_quantity",
        message: "How many units do we have?"
    }]).then(function(answers) {
        connection.query("INSERT INTO products SET ?", {
            product_name: answers.product_name,
            department_name: answers.department_name,
            price: answers.price,
            stock_quantity: answers.stock_quantity
        }, function(err, res) {
            if (err) throw err;
        });
    });
    inquirer.prompt([{
        type: "list",
        message: "Would you like to do more?",
        choices: ["Yes", "No"],
        name: "input"
    }]).then(function(response) {
        if (response.input === "Yes") {
            start();
        } else {
            connection.end(function() {
                console.log("Please log back on soon to keep up with the demand.");
            });

        }
    });
}


start();
