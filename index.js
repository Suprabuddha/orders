const { port } = require("./config");
const express = require("express");
const awsxray = require("aws-xray-sdk");
const aws = require("aws-sdk");


const awssdk = awsxray.captureAWS(aws);
awsxray.captureHTTPsGlobal(require('http'), true);
awssdk.config.update({region: process.env.REGION});
const app = express();
app.use(express.json());

const PORT = process.env.PORT || port;

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
   console.log("request**** ");        
   var orderno = request.body.orderno;
   console.log("order no== "+orderno);
   console.log("type of order no" + typeof orderno);
   var orderno_str = orderno.toString();
   const params = {
     TableName: 'orderdtl',
     Item: {
       'orderId': {N: orderno_str},
       //'orderId': orderno_str,
     }
   };
   
   var statusString = "Success"+orderno_str;
   dynamoDB.putItem(params, function(err, data) {
     if (err) {
       console.error("Error", err);
       statusString = "Error" + err;
     } else {
       console.log("Success", data);
       statusString = "Success" + "data";
     }
   });
   
   const status = {
      'Status': statusString
   };
   response.status(200);
   response.send(status);
});

app.use(awsxray.express.closeSegment());

app.listen(PORT, () => {
  console.log("Server Listening on PORT:", PORT);
});