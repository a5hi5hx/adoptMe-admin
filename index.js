const express = require('express');
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const port = 5000;
mongoose.set("strictQuery", true);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
// Middleware
app.use(express.json());
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use( express.static( "public" ) );
// Session middleware
const session = require('express-session');
app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 3600000 
  }
}));

app.get('/', (req, res) => {
    res.render('login', { message: req.session.message });
});
app.get('/logout', function(req, res) {
  req.session.destroy(function(err) {
    if(err) {
      console.log(err);
    } else {
      res.redirect('/');
    }
  });
});

const admin = require("./routes/routes");
app.use("/admin", admin);
connectDB().then(() => {
    app.listen(port, () => {
      console.log("listening for requests");
    });
  });
