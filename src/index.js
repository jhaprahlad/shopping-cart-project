const express = require("express");
const app = express();
const mongoose = require("mongoose");

const { PORT, MONGO_URL } = require("../config");

const router = require("./routes/routes.js");

const multer = require("multer");
app.use(multer().any());

app.use(express.json());

mongoose
  .connect(MONGO_URL, { useNewUrlParser: true })
  .then(() => {
    console.log("mongodb is connected");
  })
  .catch((err) => {
    console.log(err);
  });

app.use("/", router);

app.listen(PORT, () => {
  console.log(`Server is running at port no. :- ${PORT}`);
});
