/**
 * My API Server
 */
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");

// DynamoDB config
const AWS = require("aws-sdk");
AWS.config.update({
    region: "eu-west-1",
});

const docClient = new AWS.DynamoDB.DocumentClient();

// Express config
const app = express();
// Add JSON parser
app.use(bodyParser.json());
// Add logging to the mix, couple morgan middleware
const logger = morgan("tiny");
app.use(logger);

/**
 * GET home
 */
app.get("/", (req, res) => res.send("Hello iDA!"));

/**
 * GET all persons
 */
app.get("/persons", (req, res) => {
    const params = {TableName: "Personen"};

    console.log("Getting all persons...");
    docClient.scan(params).promise()
        .then((data)=>{
                console.log("got persons:", JSON.stringify(data, null, 2))},
            res.status(201).json(
                {
                    "status": "ok",
                }
            )
        )
        .catch((err)=>{
            console.error("Unable to get persons. Error:", JSON.stringify(err, null, 2))
        });
});

/**
 * GET a person
 */
app.get("/persons/:id", (req, res) => {

    const params = {
        Key: {Id: parseInt(req.params.id)},
        TableName: "Personen",
    };

    docClient.get(params).promise()
        .then((data)=>{
            console.log("got person:", JSON.stringify(data, null, 2))},
            res.status(201).json(
                {
                    "status": "ok",
                }
            )
        )
        .catch((err)=>{
            console.error("Unable to get item. Error:", JSON.stringify(err, null, 2))
        });
});

/**
 * POST person
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
app.post("/persons", (req, res) => {
    const params = req.body;

    console.log("req", params);
    console.log("Adding a new item...");
    docClient.put(params).promise()
        .then((data)=>{
                console.log("got person:", JSON.stringify(data, null, 2))},
            res.status(201).json(
                {
                    "status": "ok",
                }
            )
        )
        .catch((err)=>{
            console.error("Unable to post person. Error:", JSON.stringify(err, null, 2))
        });
});

/**
 * DELETE a person
 */
app.delete("/persons/:id", (req, res) => {

    const params = {
        Key: {Id: parseInt(req.params.id)},
        TableName: "Personen",
    };

    docClient.delete(params).promise()
        .then((data)=>{
                console.log("deleted person:", JSON.stringify(data, null, 2))},
            res.status(201).json(
                {
                    "status": "ok",
                }
            )
        )
        .catch((err)=>{
            console.error("Unable to delete person. Error:", JSON.stringify(err, null, 2))
        });
});


app.listen(4000, () => console.log("App listening on port 4000!"));