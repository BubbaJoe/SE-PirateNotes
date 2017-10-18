var express		 = require('express');
var app			 = express();
var passport 	 = require('passport');
var flash    	 = require('connect-flash');
var morgan       = require('morgan');
var bodyParser   = require('body-parser');
var session      = require('express-session');
var exphbs		 = require('express-handlebars')
var mysql		 = require('mysql');
var fs 			 = require('fs');

var port     	 = process.env.PORT || 8080;

require('./app/passport')(passport);

app.use(express.static('public'));
app.use(express.static('src/views'));
app.use(morgan('dev'));
app.use(session({
	secret:'jndpq2bdair',
	resave:true,
	saveUninitialized:true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash()); 

app.set('views', './src/views');
app.engine('handlebars',exphbs());
app.set('view engine','handlebars')

var io = require('socket.io').listen(app.listen(port,"0.0.0.0",function (err) {
	if(err)
		console.log(err);
	app.port = port;
}));

var db = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "123456"
});

require('./app/routes.js')(app, io, passport);
require('./app/database.js')(db,fs);