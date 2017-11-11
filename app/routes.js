// app/routes.js

var fs = require('fs');
var path = require('path');

module.exports = function(app, io, db, passport) {
    
    app.get('/profile', function (req,res) {
        res.redirect("/");
    });

    app.get('/department', function (req,res) {
        res.render("department")
    });

    app.get('/course/:course_id', function (req,res) {
        course_id = req.params.course_id;
        if(req.isAuthenticated()) {
            let course, posts;
            getCoursePosts( course_id ).then( results => posts = results )
            .then(() => getCourse( course_id )
            .then( results => course = results[0] )
            .then(() => {
                res.render('course', {
                    course: course,
                    posts: posts
                })
                return;
            }
            ))
        }else{
            res.redirect('/');
            return;
        }
    });

    app.get('/search', function (req,res) {
        if(req.query.q != undefined) {
            data = req.query.q.split(" ");
            console.log(data)
            res.render("search");
        } else res.render("search-blank");
    });

    app.get('/profile_image/:uid', function (req,res) {
        uid = req.params.uid;
        if(req.isAuthenticated())
            getProfilePictureByID(uid,function(result) {
                if(result[0].profile_image) {
                    res.setHeader('Content-disposition', 'attachment; filename=profile.svg');
                    res.send(result[0].profile_image);
                } else res.status(404).end();
            });
    });
    
    app.get('/', function (req,res) {
        if(req.isAuthenticated()) {
            let courses = [], myPosts = [], interests = [], notifications = [], savedPosts = [];
            getUserCourses( req.user.id ).then( results => courses = results )
            .then(() => getUserPosts( req.user.id )
            .then( results => myPosts = results )

            // .then(() => getUserSavedPosts( req.user.id )
            // .then( results => savedPosts = results )

            // .then(() => getUserNotifications( req.user.id )
            // .then( results => Notifications = results )

            .then(() => {
                res.render('home', {
                    user: req.user,
                    courses: courses,
                    myPosts: myPosts,
                    savedPosts: savedPosts,
                    notifications: notifications
                })
            })
            )
        }else{
            req.flash('danger','incorrect information')
            res.render('auth',{
                messages: req.flash('INCORRECT INFO') 
            });
        }
    });
    
    app.post('/login', function(req, res) {
        var email = req.fields.email,
        password = req.fields.password;
        login(email,password)
        .then( result => {
            if(result.length > 0) {
                id = result[0].id;
                req.login(id, (err) => {
                    if(err)console.log(err);
                    res.redirect('/');
                });
            } else {
                req.flash('alert alert-danger',
                    '<b>Sorry!</b> Incorrect login information.');
                res.redirect('/');
            }
        });
    });

    app.post('/register', function(req,res) {
        var firstname = req.fields.first_name || '',
        lastname = req.fields.last_name || '',
        email = req.fields.email || '',
        password = req.fields.password || '',
        type = 'general';

        // validate here
        if(firstname != "" && lastname != "" && email != "" && password != "")
            register(firstname,lastname,email,password,type,function(id) {
                if(id != undefined) {
                    req.login(id,
                    function(err) {
                        if(err) console.log(err);
                        res.redirect('/');
                    });
                } else {
                    req.flash('alert alert-danger','Incorrect login information.');
                    res.redirect('/');
                }
            }); else {
                req.flash('alert alert-danger','Missing information');
                res.redirect('/');
            }
    });

    app.post('/post', function(req, res) {
        if(!req.isAuthenticated()) res.redirect('/');
        var fileArr = [];
        if(req.files.fileAttachments.length)
            fileArr = req.files.fileAttachments;
        else fileArr = req.files.fileAttachments?[req.files.fileAttachments]:[];
        numFiles = fileArr.length;

        var FileTooBig = false;
        fileArr.forEach(function(file) {
            if(file.size > 10000000){
                stop = true;
            }
        });

        if(FileTooBig) {
            res.redirect('/');
            return;
        } else if(fileArr.length > 5) {
            res.redirect('/');
            return;
        }

        //course name, post text, file-arr, user-id
        createPost(req.user.id,req.fields.course,req.fields.post_text,fileArr)
        .then(() => res.redirect('/'))
    });

    app.get('/infolog',function(req,res) {
        //Check if admin/mod
        if(req.isAuthenticated())
            data = JSON.stringify(req.user,null,4);
        else data = "You are not authenticated"
        res.set('Content-Type', 'application/json');
        res.send(data);
    });
    
    app.get('/logout', function(req, res) {
        if(req.isAuthenticated())
            req.logout();
        res.redirect('/');
    });

    passport.serializeUser((user, done) => done(null, user) );
    
    passport.deserializeUser((id, done) =>
        getUserByID(id)
        .then( result => done(null, result[0]) )
        .catch( err => console.log(err) )
    );
};