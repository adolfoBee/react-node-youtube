const path = require('path');
const express  = require('express');
const app      = express();
const port     = process.env.PORT || 8080;
const mongoose = require('mongoose');
const axios = require('axios');
const {passport} = require('../config/passport');

var bodyParser   = require('body-parser');
var session      = require('express-session');

const publicPath = path.join(__dirname, '../public');

var configDB = require('../config/database.js');

// configuration
mongoose.connect( process.env.MONGODB_URI || configDB.url); // connect to our database
// set up our express application

app.use(bodyParser.json());
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(session({ secret: '123345'}));
//passport
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(publicPath));

require('../routes/routes.js')(app,passport); // load our routes and pass in our app and fully configured passport

app.listen(port);
console.log('Server running on port ' + port);