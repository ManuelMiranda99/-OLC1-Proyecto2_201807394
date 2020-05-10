const express = require("express");
const app = express();
const port = 3000;

app.listen(port, () => {
    console.log("Backend initialized on port 3000. http://localhost:3000/")
})