/*

    @author Joe Williams
    Software Engineering: East Carolina University
    PirateNotes

    routes.js - To configure the server endpoints or 'routes'.

*/

let fs = require('fs');
let path = require('path');
let referenceLink = '';

module.exports = function(app, io, db, email, passport) {

    app.get('/forgot',function () {
        //only for forgotten passwords
    })

    app.get('/tos',function () {
        // send tos doc
    })

    app.get('/verify/:uid',function () {
        // 3 cases!
        // The user id is not found, "User not found"
        // The user is already verified, "You are already verified"
        // The user verifies their self, "You have verified yourself click here to log in"
    })
    
    app.get('/profile', function (req,res) {
        res.redirect("/");
    });

    app.get('/department', function (req,res) {
        res.render("department")
    });

    app.get('/audit', function (req,res) {
        if(req.isAuthenticated()) {
            if (req.user.acc_type == 'admin' || req.user.acc_type == 'admin')
                res.render("audit"); else res.send('Unauthorized')
        }
        else res.render('404');
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
            }))
        } else {
            referenceLink = req.url;
            res.redirect('/');
            return;
        }
    });

    app.get('/profile/:uid',function (req,res) {
        uid = req.params.uid;
        if(req.isAuthenticated())
        if(uid == req.user.id) res.redirect('/')
        else res.send(uid);
    })

    app.get('/file/:file_id', function (req,res) {
        file_id = req.params.file_id;
        if(req.isAuthenticated()) {
            let fileData
            getFile(file_id)
            .then( data => {
                console.log(data)
            })
        }
    });

    app.get('/search', function (req,res) {
        if(req.isAuthenticated()) {
            res.render('search-blank',{})
        } else res.redirect('/')
    });

    app.post('/search', function (req,res) {
        console.log(req.fields)
        if(req.fields.q != undefined) {
            dataArr = req.fields.q.split(" ");
            console.log(dataArr)
            res.render("search",{
            });
        }
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
        if(req.isAuthenticated() && referenceLink) {
            res.redirect(referenceLink);
            referenceLink = '';
        } else if(req.isAuthenticated()) {
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
        } else {
            req.flash('danger','incorrect information')
            res.render('auth', {
                messages: req.flash('INCORRECT INFO') 
            });
        }
    });
    
    app.post('/login', function(req, res) {
        let email = req.fields.email,
        password = req.fields.password;
        login(email,password)
        .then( result => {
            if(result.length > 0) {
                id = result[0].id;
                req.login(id, (err) => {
                    if(err)console.log(err);
                    sendEmail(email,id)
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
        let firstname = req.fields.first_name || '',
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
        if(!req.isAuthenticated()) {
            referenceLink = req.url;
            res.redirect('/');
        }
        let fileArr = [];
        if(req.files.fileAttachments.length)
            fileArr = req.files.fileAttachments;
        else fileArr = [req.files.fileAttachments];
        numFiles = fileArr.length;

        let FileTooBig = false;
        fileArr.forEach(function(file) {
            if(file.size == 0 || file.name == '') {
                fs.unlinkSync(file.path);
                fileArr.pop(file)
            }
            if(file.size > 10000000){
                stop = true;
            }
        });

        if(FileTooBig) {
            req.flash('The file was too big (10M max)');
            res.redirect('/');
        } else if(fileArr.length > 5) {
            req.flash('Too many files (5 files max)');
            res.redirect('/');
        } else
        createPost(req.user.id,req.fields.course,req.fields.post_text,fileArr)
        .then(() => res.redirect('/'))
    });

    app.get('/infolog', function(req,res) {
        if(req.isAuthenticated() && (req.user.acc_type == 'admin' || req.user.acc_type == 'mod'))
            data = JSON.stringify(req.user,null,4);
        else data = "You are not authorized to view this data"
        res.set('Content-Type', 'application/json');
        res.send(data);
    });
    
    app.get('/logout', function(req, res) {
        if(req.isAuthenticated())
            req.logout();
        res.redirect('/');
    });

    passport.serializeUser((user, done) => done(null, user) );
    
    passport.deserializeUser((id, done) => getUserByID(id).then( result => done(null, result[0]) ).catch( err => console.log(err) ));
};