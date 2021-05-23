const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const fa = require('fontawesome');
const compression = require("compression");
const routes = require('./routes');

const PORT = process.env.PORT || 5001;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/budget";

const app = express();

app.use(logger("dev"));

app.use(compression());


app.use(express.static('public'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(routes);
// require('./routes/api')(app);
// require('./routes/html')(app);


mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: false,
  useFindAndModify: false
});

// routes



app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});