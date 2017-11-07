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

    // Create uuid 
    createUuid = function() {
        var id = uuid();
        while(id.includes('-'))id = id.replace('-','');
        return id;
    }

    // Get all user data
    getUserByID = function (id,cb) {
        db.query('select * from user where id = ?', 
        [id], function(err,result) {
            if(err)console.log(err);
            cb(result[0]);
        });
    }

    // Get user profile image
    getProfilePictureByID = function(id,cb) {
        db.query('select profile_image from user where id = ?', 
        [id,id],function(err,result) {
            if(err)console.log(err);
            console.log(result);
            cb(result);
        });
    }

    // Upload profile picture
    uploadProfilePictureByID = function(id,filedata,cb) {
        db.query('update user set profile_image = ?, where id = ?', 
        [filedata,filedata.length,id],function(err,result) {
            if(err)console.log(err);
            cb(result);
        });
    }

    // Create post
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

    // check if user is admin
    checkIfAdmin = function(user_id,cb) {

    }

    // check if user is admin or mod
    checkIfAdminOrMod = function(user_id,cb) {

    }

    // get the courses that the user is following
    getUserCourses = function(user_id,cb) {
        db.query('select * from course, (' +
        'select * from followed where user_id = ?) c ' +
        'where course.id = c.course_id', 
        [user_id],function(err,result){
            if(err) console.log(err);
            else cb(result);
        });
    }

    // Posts for the courses that the user is following
    getUserViewPosts = function(user_id,cb) {

    }

    // For admin/mod use only
    getAllPendingPosts = function(cb) {

    }

    //For admin/mod use only
    getAllPost = function(cb) {
        
    }

    //For admin/mod use only
    acceptPost = function(post_id,cb) {

    }

    //For admin/mod use only
    declinePost = function(post_id,cb) {

    }

    //For admin/mod use only
    suspendUser = function(user_id,suspend_length,cb) {
        
    }

    // For admin/mod use only
    banUser = function(user_id,cb) {

    }

    removeUserSession = function(user_id, cb) {

    }

    // Register User Information
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

    // Validate the Login information 
    login = function (email,password,cb) {
        db.query('select id from user where email = ?',
        [email],//,bcrypt.hashSync(password, null, null)
        function(err, result) {
            if(err)console.log(err); 
            else cb(result[0]);
        });
    }
}