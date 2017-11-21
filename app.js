/*
    @author Joe Williams
    Software Engineering : East Carolina University
    PirateNotes

    app.js - set up all of the server requirments

*/

// imports
let express		= require('express');
let passport 	= require('passport');
let flash    	= require('connect-flash');
let morgan      = require('morgan');
let form		= require('express-formidable');
let session     = require('express-session');
let sqlsess     = require('express-mysql-session');
let exphbs		= require('express-handlebars')
let mysql		= require('mysql');
let nodemailer  = require('nodemailer');

let port     	= process.env.PORT || 8080;
let app			= express();
let SqlSession  = sqlsess(session);

// GENERAL
app.use(express.static('public'));
app.use(express.static('src/views'));
app.use(form({
    encoding: 'utf-8',
    uploadDir: './temp_uploads',
    multiples: true
}));
app.use(morgan('dev'));

// FLASH
app.use(flash());

// HANDLEBARS
app.set('views', './src/views');
app.engine('hbs',exphbs({
    partialsDir: './src/views/partials',
    extname: '.hbs',
    helpers: {
        'iff': (conditional, options) => {
            if (options.hash.value === conditional)
                return options.fn(this); else return options.inverse(this);
        },
        'timeAgo': (options) => {
            then = Date.parse(options.hash.time)
            var diffMs = Math.abs(then - new Date()),
            diffDays = Math.floor(diffMs / 86400000),
            diffHrs = Math.floor((diffMs % 86400000) / 3600000),
            diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000)
            if (diffDays) return diffDays + ((diffDays == 1)?(" day ago"):(" days ago"))
            else if (diffHrs) return diffHrs + ((diffHrs == 1)?(" hour ago"):(" hours ago"))
            else if(diffMins) return diffMins + ((diffMins == 1)?(" minute ago"):(" minutes ago"))
            else return("Just now")
        }
    }
}));
app.set('view engine','hbs')

// SOCKET.IO
let io = require('socket.io')
.listen(app.listen(port,"0.0.0.0",
    function (err) {
        if(err) console.log(err);
        app.port = port;
    })
);

// Database class
class Database {
    constructor ( config ) {
        this.connection = mysql.createConnection( config );
    }

    query( sql, args ) {
        return new Promise( ( resolve, reject ) => {
            this.connection.query( sql, args, ( err, results ) => {
                if ( err )
                    return reject( err );
                resolve( results );
            } );
        } );
    }

    close() {
        return new Promise( ( resolve, reject ) => {
            this.connection.end( err => {
                if ( err )
                    return reject( err );
                resolve();
            } );
        } );
    }

    on( event ) {
        return new Promise( ( resolve, reject ) => {
            this.connection.on( event, (err) => {
                if( err )
                    return reject( err);
                resolve();
            } );
        } );
    }
}

let options = require('./dbinfo.json');
let db = new Database(options);
let sessionStore = new SqlSession(options);

app.use(session({
    name: 'piratenotes',
    key: '7586de50ba8111e786b61d6eec7d1af9',
    secret: 'aff851844a74488f97eac5da3a500cfa',
    store: sessionStore,
    resave: true,
    saveUninitialized: true,
    cookie: {secure: false}
}));

// PASSPORT
app.use(passport.initialize());
app.use(passport.session());

require('./app/database.js')(db);
require('./app/email.js')(nodemailer, db);
require('./app/routes.js')(app, io, db, nodemailer, passport);
