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
                        buyProducts(data.input, res[x].stock_quantity, res[x].price);
                }
            }

        });
    });
}

//Function to actually buy/order the products
function buyProducts(product, quantity, cost) {
    console.log(product);
    console.log(quantity);
    console.log(cost);
    inquirer.prompt([{
        name: "number",
        message: "How many units would you like to purchase?"
    }]).then(function(answers) {
        console.log(answers.number);
        checkout(answers.number, quantity);
    });

}
//function to check to see if you can buy the units requested
function checkout(units, quantity, cost) {
    if (units < quantity) {
        console.log("Your total will be $ " + parseInt(cost) * parseInt(units));
    } else {
        console.log("Not enough in stock");
    }
}

chooseProducts();
