/**
 * My API Server
 */

const express = require("express");
const morgan = require("morgan");

// DynamoDB
const AWS = require("aws-sdk");
AWS.config.update({endpoint: "https://dynamodb.eu-west-1.amazonaws.com"}); //process.env de variabele halen
const dynamodb = new AWS.DynamoDB();


const table = "Personen";


const app = express();

function putItem(table, item, callback) {
    let params = {
        TableName: table,
        Item: {}
    };

    for (let key of Object.keys(item)) {
        let value;
        if (typeof item[key] === "string") {
            value = {S: item[key]};
        } else if (typeof item[key] === "number") {
            value = {N: "" + item[key]};
        } else if (typeof item[key] === typeof Array) {
            value = {SS: item[key]};
        }
        params.Item[key] = value;
    }
    dynamodb.putItem(params,callback);
}

function getAllItems(table, callback) {
    let params = {
        TableName: table,
    };

    dynamodb.scan(params,callback);
}

function getItem(table, idName, id, callback) {
    let params = {
        TableName: table,
        Key: {}
    };

    params.Key[idName] = {S: id};

    dynamodb.getItem(params,callback);

}
//
// dynamodb.getItem(params, function (err, data) {
//     if (err) { // error
//         console.log(err, err.stack);
//     }
//     else { // Sucessful response
//         console.log(data);
//     }
// });

// Add logging to the mix, couple morgan middleware
const logger = morgan("tiny");
app.use(logger);

app.get("/", (req, res) => res.send("Hello World!"));

// minumum 1 comment boven.
app.get("/person", (req, res) => res.json(
    // dynamoDBInstance.get() => later
    // Return js obj mock
    dynamodb.getItem(params, function (err, data) {
            if (err) { // error
                console.log(err, err.stack);
            }
            else { // Sucessful response
                console.log(data);
            }
        }
    )
));


app.post("/person", (req, res) => {
    // Get data from request (req)
    // Do something or save to DynamoDB
    // Send answer
    res.status(201).json({
        "status": "ok",
    });
});

app.listen(4000, () => console.log("Example app listening on port 4000!"));