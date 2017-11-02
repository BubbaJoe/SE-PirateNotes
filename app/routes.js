// app/routes.js
module.exports = function(app, io, db, passport) {

    require('./database.js')(db);
    
    // Add page for the Deparment (will show all the courses for that department and how many followers)
    // Course (will show all the post from that course form users)
    // Another persons page will show their most recent posts
    // Your own page will show the most recent post from your followed courses
    
    app.get('/profile', function (req,res) {
        res.render('profile');
    });

    app.get('/profile/:uid', function (req,res) {
        uid = req.params.uid;
        getProfilePictureByID(uid,function(result) {
            if(result) {
                console.log(result);
                var buf = 
                res.send(buf);
            } else {
                res.status(404).end();
        }
        });
    });
    
    app.get('/', function (req,res) {
        if(req.isAuthenticated()) {
            res.render('home', {
                user: req.user
                // courses: {
                // },
                // myPosts: {
                // },
                // savedPosts: {
                // },
                // interests: {
                // },
                // notifications: {
                // },
                // posts: {
                // }
            });
        }else{
            // use flash to display error messages
            res.render('auth',{
            });
        }
    });
    
    app.post('/login', function(req, res) {
        var email = req.fields.email,
        password = req.fields.password;
        login(email,password,function(result) {
            if(result != undefined) {
                id = result.id;
                req.login(id, function(err) {
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
                    createProfileData(id);
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
        
        console.log(req.fields);
        console.log(req.files);

        
        // Create a post with the data provided
        res.redirect("/");
    });

    app.get('/infolog',function(req,res) {
        if(req.isAuthenticated())
            data = JSON.stringify(req.user);
        else data = "You are not authenticated"
        res.set('Content-Type', 'application/json');
        res.send(req.user || 'Not logged in');
    });
    
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    passport.serializeUser((user, done) => {
        done(null, user)
    });
    
    passport.deserializeUser((id, done) => {
        getUserByID(id,function(result) {
            done(null, result);
        });
    });
};