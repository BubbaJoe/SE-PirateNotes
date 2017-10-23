// app/routes.js
module.exports = function(app, io, db, passport) {
    require('./database.js')(db);

    app.get('/', function (req,res) {
        if(req.isAuthenticated()) {
            res.render('home', {
                user: req.user,
                courses: {},
                myPosts: {},
                savedPosts: {},
                interests: {},
                notifications: {},
                posts: {}
            });
        }else{
            res.render('auth',{});
        }
    });
    
    app.post('/login', function(req, res) {
        var email = req.fields.email,
        password = req.fields.password;
        login(email,password,function(result) {
            if(result.id) {
                req.login(result.id,function(err) {
                    if(err) throw err;
                    res.redirect('/');
                });
            } else {
                req.flash('alert alert-danger','<b>Sorry!</b> Incorrect login information.');
                res.redirect('/');
            }
        });
    });

    app.post('/register', function(req,res) {
        var firstname = req.fields.first_name,
        lastname = req.fields.last_name,
        email = req.fields.email,
        password = req.fields.password,
        passwordc = req.fields.password-confirm
        type = 'general';
        
        // validate here

        register(firstname,lastname,email,password,type,function(result) {
            if(result.id) {
                req.login(result.id,
                function(err) {
                    if(err) throw err;
                    res.redirect('/');
                });
            } else {
                req.flash('alert alert-danger','<b>Sorry!</b> Incorrect login information.');
                req.redirect('/');
            }
        });

    });

    app.get('/infolog',function(req,res) {
        console.log(req.user);
        console.log(db);
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
            console.log('query ds!');
            done(null, result);
        });
    });
};