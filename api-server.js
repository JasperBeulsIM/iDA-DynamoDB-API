/**
 * My API Server
 */
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");

// DynamoDB config
const AWS = require("aws-sdk");
const credentials = new AWS.SharedIniFileCredentials({profile: 'default'});

AWS.config.credentials = credentials;
AWS.config.update({
    region: "eu-west-1",
    endpoint: "https://dynamodb.eu-west-1.amazonaws.com" // zou ook nog uit env var moeten
});

const docClient = new AWS.DynamoDB.DocumentClient();

// Express config
const app = express();
// Add JSON parser
app.use(bodyParser.json());
// Add logging to the mix, couple morgan middleware
const logger = morgan("tiny");
app.use(logger);
// function putItem(table, item, callback) {
//     let params = {
//         TableName: table,
//         Item: {}
//     };
//
//     for (let key of Object.keys(item)) {
//         let value;
//         if (typeof item[key] === "string") {
//             value = {S: item[key]};
//         } else if (typeof item[key] === "number") {
//             value = {N: "" + item[key]};
//         } else if (typeof item[key] === typeof Array) {
//             value = {SS: item[key]};
//         }
//         params.Item[key] = value;
//     }
//     dynamodb.putItem(params,callback);
// }
//
// function getAllItems(table, callback) {
//     let params = {
//         TableName: table,
//     };
//
//     dynamodb.scan(params,callback);
// }
//
// function getItem(table, idName, id, callback) {
//     let params = {
//         TableName: table,
//         Key: {}
//     };
//
//     params.Key[idName] = {S: id};
//
//     dynamodb.getItem(params,callback);
//
// }
//
// dynamodb.getItem(params, function (err, data) {
//     if (err) { // error
//         console.log(err, err.stack);
//     }
//     else { // Sucessful response
//         console.log(data);
//     }
// });


/**
 * API GET home
 */
app.get("/", (req, res) => res.send("Hello iDA!"));

/**
 * API GET all persons
 */
app.get("/persons", (req, res) => {
    const params = {TableName : "Personen"};

    console.log("req", params);
    console.log("Getting all items...");
    docClient.scan(params, function (err, data) {
        if (err) {
            console.error("Unable to get items. Error:", JSON.stringify(err, null, 2));
        } else {
            console.log("got items:", JSON.stringify(data, null, 2));
            res.status(201).json({
                "status": "ok",
            });
        }
    });
});

/**
 * API POST person
 * example post request: {
    "TableName": "Personen",
        "Item": {
            "Id": 6,
            "FirstName": "Bert",
            "LastName": "Swinnen",
            "Email": "bert.swinnen@ida-mediafoundry.be"
        }
}
 */
app.post("/person", (req, res) => {
    const params = req.body;

    console.log("req", params);
    console.log("Adding a new item...");
    docClient.put(params, function (err, data) {
        if (err) {
            console.error("Unable to add item. Error:", JSON.stringify(err, null, 2));
        } else {
            console.log("Added item:", JSON.stringify(data, null, 2));
            res.status(201).json({
                "status": "ok",
            });
        }
    });
});

app.listen(4000, () => console.log("App listening on port 4000!"));