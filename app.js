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
var compression = require('compression')

let port     	= process.env.PORT || 8080;
let app			= express();
let SqlSession  = sqlsess(session);

// GENERAL
app.use(compression())
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
        'iff': (cond, options) => {
            if(cond == [] || cond == null || cond == undefined) return options.inverse(this)
            return (options.hash.value === cond)?options.fn(this):options.inverse(this)
        },
        'timeAgo': (options) => {
            then = Date.parse(options.hash.time)
            var diffMs = Math.abs(then - new Date()),
            diffDays = Math.floor(diffMs / 86400000),
            diffHrs = Math.floor((diffMs % 86400000) / 3600000),
            diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000)
            diffSecs = Math.round((((diffMs % 86400000) % 3600000) % 60000) / 1000)
            if (diffDays) return diffDays + ((diffDays == 1)?(" day ago"):(" days ago"))
            else if (diffHrs) return diffHrs + ((diffHrs == 1)?(" hour ago"):(" hours ago"))
            else if (diffMins) return diffMins + ((diffMins == 1)?(" minute ago"):(" minutes ago"))
            else if (diffSecs > 15) return diffSecs + " seconds ago"
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

let options = {
    port: process.env.DB_PORT,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB
}

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
require('./app/email.js')(db);

db.on('error')
.then( (err) => {
    console.log(err.code,err)
    //reset db connection
    let db = new Database(options);
    require('./app/database.js')(db);
    require('./app/email.js')(db);
})

require('./app/routes.js')(app, io, passport);
