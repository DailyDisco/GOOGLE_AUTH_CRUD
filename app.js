const path = require('path'); // path is a built in node module
const passport = require('passport');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan'); // morgan is a middleware that logs requests to the console
const exphbs = require('express-handlebars'); // express-handlebars is a middleware that allows us to use handlebars
const session = require('express-session');
const connectDB = require('./config/db');

// Load config
dotenv.config({ path: './config/config.env' });

//Passport config
require('./config/passport')(passport); 
// passport is a middleware that allows us to use passport for authentication

connectDB();

const app = express();

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Handlebars
// Add the word .engine after exphbs
// this tells express to use handlebars as the templating engine
// handlebars is a templating engine that allows us to use handlebars which is a templating language for the web that allows us to write html in javascript
app.engine(
  '.hbs',
  exphbs.engine({
    extname: '.hbs',
    extname: '.hbs',
  })
);
app.set('view engine', '.hbs');

// Sessions 
app.use(
    session({
      secret: 'keyboard cat',
      resave: false,
      saveUninitialized: false,
}))

// Passport middleware
app.use(passport.initialize()); // this middleware initializes passport
app.use(passport.session()); // this middleware initializes passport

// Static Folder
app.use(express.static(path.join(__dirname, 'public'))) // this is the default folder for static files

//Routes
// Hey server when there's a request to '/' require the index.js file
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
// we are sending the routes to the auth folder which has the routes for authentication

// app.use('/dashboard', require('./routes/index'));

const PORT = process.env.PORT || 8500;

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on PORT ${PORT}`)
);
