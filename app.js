const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const config = require("config");
const { prototype } = require("nodemailer/lib/sendmail-transport");

const db = config.get("mongoURI");

mongoose.connect(
  process.env.MONGO_URI || db,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("mongo connected");
  }
);

require("./models/user");
require("./models/post");

app.use(express.json());
app.use(require("./routes/auth"));
app.use(require("./routes/post"));
app.use(require("./routes/user"));

if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static(path.join("client/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log("Server is running on", port);
});
