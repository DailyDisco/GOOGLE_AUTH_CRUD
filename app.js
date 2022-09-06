const path = require('path'); // path is a built in node module
const passport = require('passport');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan'); // morgan is a middleware that logs requests to the console
const exphbs = require('express-handlebars'); // express-handlebars is a middleware that allows us to use handlebars
const methodOverride = require('method-override'); // method-override is a middleware that allows us to use PUT and DELETE requests
const session = require('express-session');
const MongoStore = require('connect-mongo'); 
const connectDB = require('./config/db');

// Load config
dotenv.config({ path: './config/config.env' });

//Passport config
require('./config/passport')(passport); 
// passport is a middleware that allows us to use passport for authentication

connectDB();

const app = express();

// Body parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Method override
// This allows us to swap POST and GET requests with PUT and DELETE requests
app.use(methodOverride(function(req, res){
  // check if the body exists, if the body exists, check if the _method exists, check if the override exists
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        let method = req.body._method
        delete req.body._method
        return method
    }
})); // this is a function that allows us to use PUT and DELETE requests

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Handlebars
const { formatDate, stripTags, truncate, editIcon, select } = require('./helpers/hbs');
// Add the word .engine after exphbs
// this tells express to use handlebars as the templating engine
// handlebars is a templating engine that allows us to use handlebars which is a templating language for the web that allows us to write html in javascript
app.engine(
  '.hbs',
  exphbs.engine({
    helpers: {
      formatDate,
      stripTags,
      truncate,
      editIcon,
      select
    },
    defaultLayout: 'main',
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
      store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI
      })
}))


// Passport middleware
app.use(passport.initialize()); // this middleware initializes passport
app.use(passport.session()); // this middleware initializes passport

// Set Global Variable
// We are calling next so that it moves on to the next piece of middleware
app.use(function (req, res, next) {
  res.locals.user = req.user || null
  next()
})

// Static Folder
app.use(express.static(path.join(__dirname, 'public'))) // this is the default folder for static files

//Routes
// Hey server when there's a request to '/' require the index.js file
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
// we are sending the routes to the auth folder which has the routes for authentication
app.use('/stories', require('./routes/stories'));
// app.use('/dashboard', require('./routes/index'));

const PORT = process.env.PORT || 8500;

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on PORT ${PORT}`)
);
