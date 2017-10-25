// app/routes.js
module.exports = function(app, io, db, passport) {

    require('./database.js')(db);
    
    app.get('/', function (req,res) {
        if(req.isAuthenticated()) {
            res.render('home', {
                user: req.user,
                courses: {

                },
                myPosts: {

                },
                savedPosts: {

                },
                interests: {

                },
                notifications: {

                },
                posts: {

                }
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
                req.login(result[0].id,function(err) {
                    if(err)console.log(err);
                    res.redirect('/');
                });
            } else {
                req.flash('alert alert-danger','<b>Sorry!</b> Incorrect login information.');
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
        if(!(firstname == "" || lastname == "" || email == "" || password == "" ||))
        register(firstname,lastname,email,password,type,function(result) {
            if(result != undefined) {
                req.login(result.id,
                function(err) {
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

    app.get('/infolog',function(req,res) {
        console.log(req.user);
        if(req.isAuthenticated())
            data = JSON.stringify(req.user);
        else data = "You are not authenticated"
        res.set('Content-Type', 'text/json');
        res.send(req.user);
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