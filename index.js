const express = require("express");
const awsxray = require("aws-xray-sdk");

const app = express();
app.use(express.json());
const { port } = require("./config");
const PORT = process.env.PORT || port;

awsxray.captureHTTPsGlobal(require('http'), true);



app.get('/status', (request, response) => {
   const status = {
      'Status': 'Running'
   };
   response.status(200);
   response.send(status);
});

app.listen(PORT, () => {
  console.log("Server Listening on PORT:", PORT);
});