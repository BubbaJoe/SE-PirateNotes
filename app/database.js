//database.js
var fs 			= require('fs');
var uuid		= require('uuid/v4');
var bcrypt		= require('bcrypt-nodejs');

module.exports = function(db) {

    db.on('error',function() {

    }) 

    // Create uuid 
    createUuid = function() {
        var id = uuid();
        while(id.includes('-'))id = id.replace('-','');
        return id;
    }

    // Get all user data
    getUserByID = function (id) {
        return new Promise( ( resolve, reject ) => {
            db.query('select * from user where id = ?', [id])
            .then( (result) =>  resolve(result) )
            .catch( err => console.log(err) );
        });
    }

    // Get user profile image
    getProfilePictureByID = function(id) {
        return new Promise( ( resolve, reject ) => {
            db.query('select profile_image from user where id = ?', [id,id])
            .then( (result) =>  resolve(result) )
            .catch( err => console.log(err) );
        });
    }

    // Upload profile picture
    uploadProfilePictureByID = function(id,filedata) {
        return new Promise( ( resolve, reject ) => {
            db.query('update user set profile_image = ?, where id = ?', 
            [filedata,filedata.length,id])
            .then( (result) =>  resolve(result[0]) )
            .catch( err => console.log(err) );
        });
    }

    // Create post
    createPost = function(user_id,course_id,post_text,fileArr) {
        var post_id = createUuid()
        return new Promise( ( resolve, reject ) => {
        db.query('insert into post (id,user_id,course_id,post_text,post_date,post_status) values (?,?,?,?,?,?)',
        [post_id,user_id,course_id,post_text,new Date().toLocaleString(),'pending'])
        .then( () => 
                resolve(fileArr.forEach( file => 
                    fs.readFile(file.path, (err,data) => 
                        db.query('insert into file(id,post_id,file_name,file_size,file_type,file_data) values(?,?,?,?,?,?)',
                            [createUuid(),post_id,file.name,file.size,file.type,data])
                            .then ( () => fs.unlinkSync(file.path) )
                            .catch( err => console.log(err))
                    )
                ))
            )
            .catch( err => console.log(err))
        })
    }

    getFile = function (file_id) {
        return new Promise( ( resolve, reject ) => {
            db.query('select * from file'+
            ' where id = ?',[file_id])
            .then(result => resolve(result))
            .catch(err => console.log(err))
        } );
    }

    // get the courses that the user is following
    getUserCourses = function(user_id) {
        return new Promise( ( resolve, reject ) => {
            db.query('select * from course, (select' +
            ' * from followed where user_id = ?) c ' +
            'where course.id = c.course_id', [user_id])
            .then(result => resolve(result))
            .catch(err => console.log(err));
        } );
    }

    // Posts that the user has created that are accepted
    getAcceptedUserPosts = function(user_id) {
        return new Promise( ( resolve, reject ) => {

        } );
    }

    // Posts for the courses that the user is following
    getUserViewPosts = function(user_id) {
        return new Promise( ( resolve, reject ) => {

        } );
    }

        // Posts that the user has created that are accepted
    getUserPosts = function(user_id) {
        return new Promise( ( resolve, reject ) => {
            var final_post;
            db.query('select post.*, course_name, course_num, dept_abbr, firstname, lastname'+
            ' from post inner join user on user.id = post.user_id inner '+
            'join course on course_id = course.id where user_id = ? order'+
            ' by post_date desc',[user_id])
            .then( posts => db.query('select file.* from file inner join'+ 
                ' post on post_id = post.id inner join user on user_id'+
                ' = user.id where user.id = ?',[user_id])
            .then( files => {
                if(posts.length == 0) return final_post = [];
                for(var j = 0; j < posts.length; j++) {
                    posts[j].files = [];
                    for(var i = 0; i < files.length; i++) {
                        if(files[i].post_id == posts[j].id) {
                            posts[j].files.push(files[i])
                        }
                    }
                }
                final_post = posts;
            }))
            .then(() => resolve(final_post))
            .catch( err => console.log(err) )
        } );
    }

    // Posts that the user has created that are accepted
    getCoursePosts = function(course_id) {
        return new Promise( ( resolve, reject ) => {
            var final_post;
            db.query('select post.*, firstname, lastname from post inner'+
            ' join user on user.id = post.user_id inner join course on course_id'+
            ' = course.id where course_id = ? order by post_date desc', [course_id])
            .then( posts => db.query('select file.* from file inner join'+ 
                ' post on post.id = post_id where course_id = ? ',[course_id])
            .then( files => {
                if(posts.length == 0) return final_post = [];
                for(var j = 0; j < posts.length; j++) {
                    posts[j].files = [];
                    for(var i = 0; i < files.length; i++) {
                        if(files[i].post_id == posts[j].id) {
                            posts[j].files.push(files[i])
                        }
                    }
                }
                final_post = posts;
            }))
            .then(() => resolve(final_post))
            .catch( err => console.log(err) )
        } );
    }

    getCourse = function(course_id) {
        return new Promise( ( resolve, reject ) => {
            db.query('select * from course ' +
            'where course.id = ?', 
            [course_id])
            .then(result => resolve(result))
            .catch(err => console.log(err));
        } );
    }

    // For admin/mod use only
    getAllPendingPosts = function() {
        return new Promise( ( resolve, reject ) => {

        } );
    }

    //For admin/mod use only
    getAllPost = function() {
        return new Promise( ( resolve, reject ) => {

        } );
    }


    //For admin/mod use only
    acceptPost = function(post_id) {
        return new Promise( ( resolve, reject ) => {
            
        } );
    }

    //For admin/mod use only
    declinePost = function(post_id) {
        return new Promise( ( resolve, reject ) => {

        } );
    }

    //For admin/mod use only
    suspendUser = function(user_id,suspend_length) {
        return new Promise( ( resolve, reject ) => {

        } );
    }

    // For admin/mod use only
    banUser = function(user_id) {
        return new Promise( ( resolve, reject ) => {

        } );
    }
        // check if user is admin
    checkIfAdmin = function(user_id) {
        return new Promise( ( resolve, reject ) => {} );
    }

    // check if user is admin or mod
    checkIfAdminOrMod = function(user_id) {
        return new Promise( ( resolve, reject ) => {} );
    }

    // check if user is mod
    checkIfMod = function(user_id) {
        return new Promise( ( resolve, reject ) => {} );
    }

    // Register User Information
    register = function (firstname,lastname,email,password,type) {
        var id = createUuid();
        return new Promise( ( resolve, reject ) => {
        db.query('insert into user(id,firstname,lastname,email,password,profile_desc,acc_type,acc_status) values(?,?,?,?,?,?,?,?)',
        [id,firstname.trim(),lastname.trim(),email,bcrypt.hashSync(password, null, null),"",type,"active"])
        .then( () =>  resolve(id) )
        .catch( err => console.log(err) );
    });
    }

    // Validate the Login information 
    login = function (email,password) {
        return new Promise( ( resolve, reject ) => {
            db.query('select id from user where email = ?',
            [email])//,bcrypt.hashSync(password, null, null)]
            .then( (result) => resolve(result))
        });
    }
}