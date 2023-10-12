const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const router = require("./routes/router");
require("dotenv").config();

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const corsOptions = {
  origin: "*",
  credintials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use("/", router);

const port = process.env.PORT || 3001; 
const server = app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});