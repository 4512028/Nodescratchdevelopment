const mongoose = require("mongoose");
const MONGO_URI = process.env.MONGO_URI;

const connectDatabase = () => {
  mongoose
    .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      console.log("Mongoose Connected");
    })
    .catch((err) => {
      console.log("Not Connected to Database ERROR! ", err);
    });
};

module.exports = connectDatabase;
