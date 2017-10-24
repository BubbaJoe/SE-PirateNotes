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
app.use(form());
app.use(morgan('dev'));

// PASSPORT
app.use(passport.initialize());
app.use(passport.session());

// FLASH
app.use(flash());

// HANDLEBARS
app.set('views', './src/views');
app.engine('hbs',exphbs({}));
app.set('view engine','hbs')

// SOCKET.IO
var io = require('socket.io').listen(app.listen(port,"0.0.0.0",function (err) {
	if(err)
		console.log(err);
	app.port = port;
}));

// DB
const options = require('./dbinfo.json');
var db = mysql.createConnection(options);
var sessionStore = new sqlsession(options);

app.use(session({
   key: 'session_cookie_name',
   secret: 'session_cookie_secret',
   store: sessionStore,
   resave: false,
   saveUninitialized: false,
   cookie: { maxAge: 3600000/2 }
}));


require('./app/handlebars.js')(exphbs);
require('./app/routes.js')(app, io, db, passport);