const express = require("express");
require("dotenv").config();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const Router = require("./src/router");
const helmet = require("helmet");

const port = 4000;
const app = express();

const corsOptions = {
    origin: "*",
    optionsSuccessStatus: 200,
};

app.use(helmet());
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan("combined"));

app.get("/", (req, res) => {
    res.status(200).json({ status: 200, message: "server running" });
});

app.get("/", (req, res) => {
    res.status(200).json({ status: 200, message: "server running" });
});

app.use(Router);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
