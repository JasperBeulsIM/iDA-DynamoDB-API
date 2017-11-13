const AWS = require("aws-sdk");

AWS.config.update({
    accessKeyId: "",
    secretAccessKey: "",
    region: "eu-west-1",
    endpoint: "https://dynamodb.eu-west-1.amazonaws.com"
});

const docClient = new AWS.DynamoDB.DocumentClient();

const table = "Personen";

const params = {
    TableName: table,
    Item: {
        "Id": 4,
        "FirstName": "Onno",
        "LastName": "Vencker",
        "Email": "onno.vencker@ida-mediafoundry.be",
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