//database.js
var fs 			= require('fs');
var uuid		= require('uuid/v1');
var bcrypt		= require('bcrypt-nodejs');

module.exports = function(db) {

    db.on('error',function(err) {
        console.log(err);
        db = require('mysql')
            .createConnection(require('../dbinfo.json'));
        require('./database')(db);
    });

    createUuid = function() {
        var id = uuid();
        while(id.includes('-'))id = id.replace('-','');
        return id;
    }

    runFileQuery = function (fileName) {
            fs.readFile('../sql/'+fileName,
            'utf8', function(err,data) {
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

    getUserByID = function (id,cb) {
            db.query('select * from user where id = ?', 
            [id], function(err,result) {
                if(err)console.log(err);
                cb(result[0]);
            });
    }

    getProfilePictureByID = function(id,cb) {
        db.query('select profile_image, profile_image_size from user where id = ?', 
        [id],function(err,result) {
            if(err)console.log(err);
            console.log(result);
            cb(result);
        });
    }

    uploadProfilePictureByID = function(id,filedata,cb) {
        db.query('update user set profile_image = ?, profile_image_size = ?, where id = ?', 
        [filedata,filedata.length,id],function(err,result) {
            if(err)console.log(err);
            cb(result);
        });
    }

    createProfileData = function(id) {
        var bool = true;
        db.query('insert into profile_data (id, description) values (?,?)',
        [id,''],
        function(err,result){
            if(err) {
                console.log(err);
                bool = false;
            }
        }); 
        return bool;
    }

    createPost = function(user_id,course_id,post_text,fileArr,cb) {
        var post_id = createUuid();
        // creates the post
        db.query('insert into post (id,user_id,course_id,post_text,post_date,post_status) values (?,?,?,?,?,?)',
        [post_id,user_id,course_id,post_text,new Date().toLocaleString(),'pending'],function(err,results){
            for(var i = 0; i < fileArr.length; i++) {
                // create a multiple files for each post
                fs.readFile(fileArr[i].path,function(err,data) {
                    db.query('insert into file(id,post_id,file_name,file_size,file_type,file_data) values(?,?,?,?,?,?)',
                        [createUuid(),post_id,fileArr[i].name,fileArr[i].size,fileArr[i].type,data], 
                        function(err,results) {
                            if(err) console.log(err);
                            else console.log(results);
                        });
                });
            }
        });
    }

    getPendingPosts = function(user_id,cb) {
        // if the user is admin or normal

        // get the information
    }

    a = function() {

    }

    register = function (firstname,lastname,email,password,type,cb) {
            var id = createUuid();
            db.query('insert into user(id,firstname,lastname,email,password,profile_desc,acc_type,acc_status) values(?,?,?,?,?,?,?,?)',
            [id,firstname.trim(),lastname.trim(),email,bcrypt.hashSync(password, null, null),"",type,"active"],
            function(err, result) {
                if(err){
                    console.log(err);
                } else cb(id);
            });
    }

    login = function (email,password,cb) {
        db.query('select id from user where email = ?',
        [email],//,bcrypt.hashSync(password, null, null)
        function(err, result) {
            if(err)console.log(err); 
            else cb(result[0]);
        });
    }
}