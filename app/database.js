var fs 			= require('fs');
var uuid		= require('uuid/v4');
var bcrypt		= require('bcrypt-nodejs');

module.exports = function(db) {
    db.on('error',function(err) {
        console.log(err);
        db = require('mysql')
            .createConnection(require('../dbinfo.json'));
        require('./database')(db);
    })

    runFileQuery = function (fileName) {
            fs.readFile('../sql/'+fileName,
            'utf8',
            function(err,data) {
                if(err)console.log(err);
                db.query(data, function(err,result) {
                    return result;
                });
            });
    }

    runQuery = function (query) {
            db.query(query, function(err, result) {
                if(err)console.log(err);
                return result;
            });
    }

    runQuery = function (query,values) {
            db.query(query,values,function(err, result) {
                if(err)console.log(err);
                return result;
            });
    }

    getUserByID = function(id,cb) {
            db.query('select * from user where id = ?',[id],function(err,result) {
                if(err)console.log(err);
                if(result)console.log(result[0]);
                cb(result[0]);
            });
    }

    register = function (firstname,lastname,email,password,type,cb) {
            var id = uuid();
            db.query('insert into user(id,firstname,lastname,email,password,desc_text,acc_type,acc_status) values(?,?,?,?,?,?,?,?)',
            [id,firstname.trim(),lastname.trim(),email,bcrypt.hashSync(password, null, null),"",type,"active"],
            function(err, result) {
                if(err)console.log(err);
                if(result)console.log(result[0]);
                cb(result);
            });
    }

    login = function (email,password,cb) {
            db.query('select id from user where email = ?',
            [email],//bcrypt.hashSync(password, null, null)
            function(err, result) {
                if(err)console.log(err);
                if(result)console.log(result[0]);
                cb(result);
            });
    }
}