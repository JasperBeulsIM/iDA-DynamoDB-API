const AWS = require("aws-sdk");
const credentials = new AWS.SharedIniFileCredentials({profile: 'default'});
AWS.config.credentials = credentials;

AWS.config.update({
    region: "eu-west-1",
    endpoint: "https://dynamodb.eu-west-1.amazonaws.com"
});

const docClient = new AWS.DynamoDB.DocumentClient();

const table = "Personen";

let params = {
    TableName: table,
    Item: {
        "Id": 5,
        "FirstName": "Jan",
        "LastName": "Pecquet",
        "Email": "jan.pecquet@ida-mediafoundry.be",
    }
};

console.log("Adding a new item...");
docClient.put(params, function (err, data) {
    if (err) {
        console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("Added item:", JSON.stringify(data, null, 2));
    }
});

params = {
    TableName: table,
};

console.log("Getting all items...");
docClient.scan(params, function (err, data) {
    if (err) {
        console.error("Unable to get items. Error:", JSON.stringify(err, null, 2));
    } else {
        console.log("got items:", JSON.stringify(data, null, 2));
    }
});