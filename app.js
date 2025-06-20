const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'webpage')));

app.listen(3000, "0.0.0.0", () => {
  console.log("Server is up and running");
})