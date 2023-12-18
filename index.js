const express = require("express");
const awsxray = require("aws-xray-sdk");
const aws = require("aws-sdk");

const awssdk = awsxray.captureAWS(aws);
awsxray.captureHTTPsGlobal(require('http'), true);
const app = express();
app.use(express.json());
const { port } = require("./config");
const PORT = process.env.PORT || port;

awssdk.config.update({region: 'REGION'});
const dynamoDB = new awssdk.DynamoDB({apiVersion: '2012-08-10'});

awsxray.captureHTTPsGlobal(require('http'), true);
awsxray.config([awsxray.plugins.ECSPlugin]);

app.use(awsxray.express.openSegment('MyApp'));

app.get('/status', (request, response) => {
   const status = {
      'Status': 'Running new'
   };
   response.status(200);
   response.send(status);
});

app.post('/create', (request, response) => {
   const params = {
     TableName: 'orderdtl',
     Key: {
       'orderId': {N: request.body.orderno},
     }
   };
   
   dynamoDB.putItem(params, function(err, data) {
     if (err) {
       console.error("Error", err);
     } else {
       console.log("Success", data);
     }
   });
   
   const status = {
      'Status': 'New item is added'
   };
   response.status(200);
   response.send(status);
});

app.use(awsxray.express.closeSegment());

app.listen(PORT, () => {
  console.log("Server Listening on PORT:", PORT);
});