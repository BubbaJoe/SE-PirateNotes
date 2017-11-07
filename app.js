var express		= require('express');
var passport 	= require('passport');
var flash    	= require('connect-flash');
var morgan      = require('morgan');
var form		= require('express-formidable');
var session     = require('express-session');
var sqlsession	= require('express-mysql-session')(session);
var exphbs		= require('express-handlebars')
var mysql		= require('mysql');

var port     	= process.env.PORT || 8080;
var app			= express();

// GENERAL
app.use(express.static('public'));
app.use(express.static('src/views'));
app.use(form({
    encoding:'utf-8',
    uploadDir: './temp_uploads',
    multiples:true
}));
app.use(morgan('dev'));

// FLASH
app.use(flash());
app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
  });

// HANDLEBARS
app.set('views', './src/views');
app.engine('hbs',exphbs({
    helpers: {
        log: function(options) {
            console.log(options);
        }
    }
}));
app.set('view engine','hbs')

// SOCKET.IO
var io = require('socket.io')
.listen(app.listen(port,"0.0.0.0",
    function (err) {
        if(err) console.log(err);
        app.port = port;
    })
);

// DB AND SESSION
const options = require('./dbinfo.json');

var db = mysql.createConnection(options);
var sessionStore = new sqlsession(options);

app.use(session({
    name: 'piratenotes',
    key: '7586de50ba81-11e7-86b6-1d6eec7d1af9',
    secret: 'aff85184-4a74-488f-97ea-c5da3a500cfa',
    store: sessionStore,
    resave: true,
    saveUninitialized: false,
    cookie: {maxAge: 3600000/2}
}));

// PASSPORT
app.use(passport.initialize());
app.use(passport.session());

//require('./app/handlebars.js')(exphbs);
require('./app/database.js')(db);
require('./app/routes.js')(app, io, db, passport);