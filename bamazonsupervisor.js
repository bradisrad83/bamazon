var inquirer = require("inquirer");
var mysql = require("mysql");
var Table = require("cli-table");
var departmentArray = [];
var table = new Table({
    head: ["Department ID", "Department Name", "Over Head Cost", "Product Sales", "Total Profit"],
    colWidths: [15, 30, 20, 20, 20]
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
        message: "Which of the following would you like to do?",
        choices: ["View Product Sales by Department", "Create New Department"],
        name: "input"
    }]).then(function(data) {
        if (data.input === "View Product Sales by Department") {
            showSales();
        } else {
            createDepartment();
        }
    });
}

function showSales() {
    console.log("SHOWSALES");
    inquirer.prompt([{
        type: "list",
        message: "More work??",
        choices: ["Yes", "No"],
        name: "input"
    }]).then(function(response) {
        if (response.input === "Yes") {
            start();
        } else {
            connection.end(function() {
                console.log("Have a wonderful day")
            });

        }
    });

}

function createDepartment() {
    console.log("CREATE DEPARTMENT");
    inquirer.prompt([{
        type: "list",
        message: "More work??",
        choices: ["Yes", "No"],
        name: "input"
    }]).then(function(response) {
        if (response.input === "Yes") {
            start();
        } else {
            connection.end(function() {
                console.log("Have a wonderful day")
            });

        }
    });
}


start();
