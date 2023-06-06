const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const errorMiddleware = require("./src/middlewares/error");

const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// const user = require("./routes/userRoute");

// app.use("/api/v1", user);
app.get("/", (req, res) => {
  res.send("Server is Running! 🚀");
});
// error middleware
app.use(errorMiddleware);

module.exports = app;
