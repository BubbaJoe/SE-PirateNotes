var fs 			= require('fs');
var uuid		= require('uuid-lib');
var bcrypt		= require('bcrypt-nodejs');

module.exports = function(db) {

    runFileQuery = function (fileName) {
        db.connect(function(err) {
            if(err) throw err;
            fs.readFile('./sql/'+fileName,
            'utf8',
            function(err,data) {
                if(err) throw err;
                db.query(data, function(err,result) {
                    return result;
                });
            });
        });
    }

    runQuery = function (query) {
        db.connect(function(err) {
            if(err) throw err;
            db.query(query, function(err, result) {
                if(err) throw err;
                return result;
            });
        });
    }

    runQuery = function (query,values) {
        db.connect(function(err) {
            if(err) throw err;
            db.query(query,values,function(err, result) {
                if(err) throw err;
                return result;
            });
        });
    }

    getUserByID = function(id,cb) {
        db.connect(function(err) {
            db.query('select * from user where id = ?',[id],function(err,result) {
                if(err) throw err;
                cb(result[0]);
            });
        });
    }

    register = function (firstname,lastname,email,password,type,cb) {
        db.connect(function(err) {
            var id = uuid.raw();
            db.query('insert into user(id,firstname,lastname,email,password,desc_text,acc_type,acc_status) values(?,?,?,?,?,?,?,?)',
            [id,firstname.trim(),lastname.trim(),email,bcrypt.hashSync(password, null, null),"",type,"active"],
            function(err, result) {
                cb(err,result);
            });
        });
    }

    login = function (email,password,cb) {
        db.connect(function(err) {
            db.query('select id from user where email = ?',
            [email],//bcrypt.hashSync(password, null, null)
            function(err, result) {
                if(err) throw err;
                cb(result[0]);
            });
        });
    }
}