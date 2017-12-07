/*

    @author Joe Williams
    Software Engineering: East Carolina University
    PirateNotes

    routes.js - To configure the server endpoints or 'routes'.

*/

let fs      = require('fs')
let path    = require('path')
let bcrypt	= require('bcrypt-nodejs')
let async   = require('async')

// referenceLink = (the last link they requested before session ended)
let referenceLink = []
let forgotCode = []

// Number of active users on the website
let numActiveUsers = 0
let requestArray = []

// Express, Socket.IO, MySQL, and Passport
module.exports = (app, io, pp) => {
    
    // Temp file cleaner
    async function trash() {
        await setTimeout( () => {
            p = __dirname+"/../temp_uploads/"
            fs.readdir(path.resolve(p),{},(err,files) => {
                files.forEach((file) => {
                    // If the file is older than a minute
                    if(file != '.gitignore' && (new Date() - Date.parse(fs.statSync(p+file).birthtime) > 60000))
                        fs.unlink(p+file, () => {
                            console.log('removed '+file)
                        } )
                })
            })
            trash()
        }
        , 5000)
    }

    trash()

    // Socket.io handler
    io.sockets.on('connection',(socket) => {

        numActiveUsers ++

        socket.on("follow:department", (data) => {
            console.log("dept:")
            followDepartment(data.id,data.dept_id)
            .then(() => console.log("Followed"))
            .catch(() => console.log("Already following!"))
        })

        socket.on("follow:course", (data) => {
            console.log("course:")
            followCourse(data.id,data.course_id)
            .then(() => console.log("Followed"))
            .catch(() => console.log("Already following!"))
        })

        socket.on("like", (data) => {
            likePost(data.id,data.post_id)
            .then(() => console.log("saved"))
            .catch(() => console.log("Already like!"))
        })

        socket.on("save", (data) => {
            savePost(data.id,data.post_id)
            .catch(() => console.log("Already saved!"))
        })

        socket.on("unfollow:department", (data) => {
            unfollowDepartment(data.id,data.dept_id)
            .then(() => console.log("unFollowed"))
        })

        socket.on("unfollow:course", (data) => {
            unfollowCourse(data.id,data.course_id)
            .then(() => console.log("unFollowed"))
        })

        socket.on("unlike", (data) => {
            unlikePost(data.id,data.post_id)
            .then(() => console.log("unliked"))
        })

        socket.on("unsave", (data) => {
            unsavePost(data.id,data.post_id)
            .then(() => console.log("unsaved"))
        })

        socket.on("accept", (data) => {
            acceptPost(data)
            .then(() => console.log("accepted"))
        })

        socket.on("decline", (data) => {
            declinePost(data)
            .then(() => console.log("declined"))
        })

        socket.on('disconnect', (socket) => {
            numActiveUsers --
        })

    });

    //Routes for endpoints

    app.get('/tos', (req,res) => {
        res.download(__dirname+'/../TermsOfService.pdf')
    })

    app.post('/forgot', (req,res) => {
        runQuery('select email from user where email = ? ',[req.fields.email])
        .then( (user) => {
            if(user[0]) {
                code = Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000
                forgotCode[code] = user[0].id
                res.redirect('/')
                sendPasswordEmail(user[0].email, code) 
            } else {
                req.flash('forgotError','This email is not regsitered')
                res.redirect('/#forgotpass')
            }
        })
    })

    app.post('/changepass', (req,res) => {
        let u = req.fields,
        code = u.verificationCode
        if(u.password == u.passwordConfirm) {
            if(!forgotCode[code]) {
                req.flash('verificationError','Verification Code Invalid')
                return res.redirect('/#resetpass')    
            } else {
                updateUserPassword(id,p.newPassword)
                delete forgotCode[code]
                res.redirect('/')
            }
        } else {
            req.flash('verificationError','Passwords do not match')
            return res.redirect('/#resetpass')
        }
    })

    app.get('/verify/:code', (req,res) => {
        if(!req.params.code) res.redirect('/')
        uid = req.params.code
        verifyUser(uid)
        .then( () => {
            console.log()
            res.redirect('/verified')
        })
    })

    app.get('/account', (req, res) => {
        if(req.isAuthenticated()) {
            res.render('account',{
                user: req.user,
                first:req.flash('first'),
                last:req.flash('last'),
                desc:req.flash('desc'),
                gender:req.flash('gender'),
                major:req.flash('major'),
                accountError: req.flash('accountError')
            })
        } else {
            referenceLink[req.ip] = req.url
            res.redirect('/')
        }
    })

    app.get('/updateprofile',(req,res) => res.redirect('/account') )
    app.post('/updateprofile', (req, res) => {
        if(req.isAuthenticated()) {
            p = req.fields
            id = req.user.id
            console.log(p)
            refill = function(a) {
                if(!a) a = ''
                req.flash('first',p.first)
                req.flash('last',p.last)
                req.flash('desc',p.description)
                req.flash('gender',p.gender)
                req.flash('major',p.major)
                res.redirect('/account'+ a)
            }

            if(bcrypt.compareSync(p.password, req.user.password)) {

                if(p.first.trim() == '' || p.last.trim() == '') {
                    req.flash('accountError','First or Last name may not be empty')
                    if(p.first.trim() == '')
                    return refill('#first')
                    else return refill('#last')
                }

                updateUserName(id,p.first.trim(),p.last.trim())
                updateUserGender(id,p.gender)
                updateUserMajor(id,p.major)
                updateUserInterests(id,p.interests)
                updateProfileDesc(id,p.description)

                if(req.files.profile_image.size > 0) {
                    if('image/x-png,image/gif,image/jpeg'.includes(req.files.profile_image.type))
                        updateProfileImage(id,req.files.profile_image)
                    else {
                        req.flash('accountError','Incorrect file type for the picture')
                        return refill('#profile_image')
                    }
                }
                else setTimeout(() => fs.unlinkSync(req.files.profile_image.path), 3000)

                if(p.newPassword) {
                    if(p.newPassword == p.newPasswordConfirm)
                        updateUserPassword(id,p.newPassword)
                    else {
                        req.flash('accountError','Passwords don\'t match')
                        return refill('#newPassword')
                    }
                }
                res.redirect('/')
            } else {
                accountError: req.flash('accountError',"Wrong Password")
                return refill('#password')
            }
        } else {
            referenceLink[req.ip] = req.url
            res.redirect('/')
        }
    })
    
    app.get('/profile',  (req,res) => {
        res.redirect("/")
    })

    app.get('/department/:did', (req,res) => {
        if(req.isAuthenticated()) {
            getUserCourses( req.user.id )
            .then( (courses) =>
            getDepartment( req.params.did )
            .then( (department) => 
            getDepartmentCourses(req.params.did, req.user.id)
            .then( (_courses) => {
                res.render('department',{
                    user: req.user,
                    department: department,
                    courses: courses,
                    _courses: _courses
                })
                console.log(_courses)
                req.login(req.user.id,()=>{})
                }
            )))
        }
    })

    app.get('/audit', (req,res) => {
        if(req.isAuthenticated()) {
            if (req.user.acc_type == 'admin' || req.user.acc_type == 'mod') {
                delete req.user.acc_type
                getUserCourses(req.user.id)
                .then( courses =>
                getAllPendingPosts()
                .then( (posts) =>
                res.render("audit",{
                    user: req.user,
                    enabled: true,
                    posts: posts,
                    courses: courses
                })))
                req.login(req.user.id,()=>{})
            }
        } else {
            referenceLink[req.ip] = req.url
            res.redirect('/')
        }
    })

    app.get('/admin', (req,res) => {
        if(req.isAuthenticated()) {
            if (req.user.acc_type == 'admin' || req.user.acc_type == 'mod') {
                getUserCourses()
                .then( (courses) =>
                res.render("admin",{
                    user: req.user,
                    _courses: courses
                }))
                req.login(req.user.id,()=>{})
            }
        } else {
            referenceLink[req.ip] = req.url
            res.redirect('/')
        }
    })

    app.post('/audit/query', (req,res) => {
        q = req.fields.query_textbox
        if(req.isAuthenticated()) {
            if (req.user.acc_type == 'admin') {
                runQuery(q)
                .then( (results) => {
                    res.render("audit",{
                        user: req.user,
                        list: results
                    })
                    req.login(req.user.id,()=>{})
                })
            }
            else res.send('Unauthorized')
        } else {
            referenceLink[req.ip] = req.url
            res.redirect('/')
        }
    })

    app.get('/course/:course_id', (req,res) => {
        course_id = req.params.course_id
        if(req.isAuthenticated()) {
            let course, posts, courses
            getCoursePosts( course_id )
            .then( results => posts = results )
            .then( () => getCourse( course_id )
            .then( results => course = results )
            .then( () => getUserCourses( req.user.id )
            .then( results => courses = results ))
            .then( () => {
                res.render('course', {
                    user: req.user,
                    course: course,
                    posts: posts,
                    courses: courses
                })
                req.login(req.user.id,()=>{})
            }))
        } else {
            referenceLink[req.ip] = req.url
            res.redirect('/')
            return
        }
    })

    app.get('/profile/:uid', (req,res) => {
        uid = req.params.uid
        if(req.isAuthenticated())
        if(uid == req.user.id) res.redirect('/')
        else res.send(uid)
    })

    app.get('/file/:file_id', (req,res) => {
        file_id = req.params.file_id
        if(req.isAuthenticated()) {
            let fileData, path
            getFile(file_id)
            .then( f => {
                path = './temp_uploads/'+Math.round(Math.random()*999999999)

                if(f) fs.writeFile(path, f.file_data, (err) => res.download(path,f.file_name) )
            })
        } else {
            referenceLink[req.ip] = req.url
            res.redirect('/')
            return
        }
    })

    app.get('/search', (req,res) => {
        if(req.isAuthenticated()) {
            getUserCourses( req.user.id )
            .then( (user_courses) => 
                res.render('search-blank',{
                    user: req.user,
                    courses: user_courses
                })
            )
        } else {
            referenceLink[req.ip] = req.url
            res.redirect('/')
            return
        }
    })

    app.post('/search', (req,res) => {
        if(req.isAuthenticated()) {
            if(req.fields.q != undefined) {
                let wordArr = req.fields.q.split(" "),
                courseArr = [],
                userCourses = []
                departmentArr = [],
                lastCourseArr = [],
                lastDepartmentArr = []
                wordObjArray = []
                wordArr.forEach( (word, count) => {
                    if(word !== ' ') {
                        wordObj = {word: word, numResults: 0}
                        wordObjArray.push(wordObj)
                    }
                    searchCourse(word)
                    .then( (courses) => {
                        wordObjArray[wordObjArray.indexOf(wordObjArray.find((e) => e.word == word ))].numResults += courses.length
                        courses.forEach( (course, i) => {
                            if(!courseArr.find((c) => c.id == course.id ))
                                courseArr.push(course)
                        } )
                    } )
                    .then( () =>
                    searchDepartment(word)
                    .then( (departments) => {
                        wordObjArray[wordObjArray.indexOf(wordObjArray.find((e) => e.word == word ))].numResults += departments.length
                        departments.forEach( (department, i) => {
                            if(!departmentArr.find((d) => d.id == department.id ))
                                departmentArr.push(department)
                        } )
                    } )
                    .then( () => getUserCourses( req.user.id )
                        .then( (user_courses) => userCourses = user_courses )
                    )
                    .then( () => {
                        if(count == wordArr.length-1) {
                            res.render("search", {
                                wordArray: wordObjArray,
                                searchString: req.fields.q,
                                user: req.user,
                                courses: userCourses,
                                _courses: courseArr,
                                _departments: departmentArr
                            })
                            req.login(req.user.id,()=>{})
                        }
                    }))
                })
            }
        } else {
            referenceLink[req.ip] = req.url
            res.redirect('/')
        }
    })

    app.get('/profile_image', (req, res) => {
        if(res.headerSent) return res.status(404).end()
            if(req.isAuthenticated()) {
                if(req.user.profile_image) {
                    p = __dirname+"/../temp_uploads/upload_"+Math.round(Math.random()*999999999)
                    return fs.writeFile(path.resolve(p),req.user.profile_image, () => {
                        res.sendFile(path.resolve(p))
                    })
                } else {
                    res.sendFile(path.resolve(__dirname+'/../public/images/'+ ((req.user.gender == 'male')?'m':'w')+'_profile.svg'),{}, () => {
                    })
                }
            } else {
                return res.send('unauthorized')
            }
    })

    app.get('/profile_image/:uid', (req, res) => {
        if(res.headerSent) return res.status(404).end()
        uid = req.params.uid
        if(req.isAuthenticated()) {
            if(uid === req.user.id) {
                return res.redirect('/profile_image')
                if(req.user.profile_image) {
                    p = __dirname+"/../temp_uploads/upload_"+Math.round(Math.random()*999999999)
                    return fs.writeFile(path.resolve(p),req.user.profile_image, () => {
                        res.sendFile(path.resolve(p))
                    })
                } else {
                    var options = {
                        dotfiles: 'deny',
                        headers: {
                            'x-timestamp': Date.now(),
                            'x-sent': true
                        }
                    };
                    res.set('Content-Type','image/svg+xml')
                    return res.sendFile(path.resolve(__dirname+'/../public/images/'+ ((req.user.gender == 'male')?'m':'w')+'_profile.svg'), options, (err) => {
                        console.log("File sent")
                    })
                }
            } else {
                getProfilePictureByID(uid)
                .then( (result) => {
                    if(result.profile_image) {
                        p = __dirname+"/../temp_uploads/"+Math.round(Math.random()*999999999)
                        return fs.writeFile(path.resolve(p),result.profile_image, () => {
                            res.sendFile(path.resolve(p))
                        })
                    } else {
                    return res.sendFile(path.resolve(__dirname+'/../public/images/'+ ((result.gender == 'male')?'m':'w')+'_profile.svg'))
                    }
                })
            }
        } else {
            return
        }
    })
    
    app.get('/', (req,res) => {
        if(req.isAuthenticated() && referenceLink[req.ip]) {
            res.redirect(referenceLink[req.ip])
            delete referenceLink[req.ip]
        } else if(req.isAuthenticated()) {
            let courses = [], departments, myPosts = [], interests = [], notifications = [], savedPosts = []
            getUserCourses( req.user.id ).then( results => courses = results )
            .then( () => getUserViewPosts( req.user.id )
            .then( results => myPosts = results ))
            .then( () => getUserDepartments( req.user.id )
            .then( (depts) => departments = depts ))
            .then( () => getUserSavedPosts( req.user.id )
            .then( results => savedPosts = results ))
            .then(() => getUserNotifications( req.user.id )
            .then( results => notifications = results ))
            .then(() => {
                interests = (interests == '') ? interests = null : req.user.interests.split(", ");
                res.render('home', {
                    alert: req.flash('alert'),
                    user: req.user,
                    courses: courses,
                    interests: interests,
                    departments: departments,
                    myPosts: myPosts,
                    savedPosts: savedPosts,
                    notifications: notifications
                })
                req.login(req.user.id,()=>{})
            })
        } else {
            res.render('auth', {
                firstname: req.flash('firstname'),
                lastname: req.flash('lastname'),
                email: req.flash('email'),
                loginError: req.flash('loginError'),
                registerError: req.flash('registerError'),
                forgotError: req.flash('forgotError'),
                verificationError: req.flash('verificationError')
            })
        }
    })

    //post
    app.get('/login',(req,res) => res.redirect('/') )
    app.post('/login', (req, res) => {
        let email = req.fields.email,
        password = req.fields.password
        login(email,password)
        .then( result => {
            if(result) {
                switch(result.acc_status) {
                    case 'banned':
                    req.flash('loginError','Your account is banned. You have disobeyed the terms of service.')
                    res.redirect('/')
                    break
                    case 'unverified':
                    req.flash('loginError','Your account is unverified. Please check your email!')
                    res.redirect('/')
                    break
                    default:
                    req.login(result.id, () => res.redirect('/'))    
                }
            } else {
                req.flash('loginError','Incorrect login information')
                res.redirect('/')
            }
        })
    })

    app.get('/thankyou', (req,res) => res.redirect('/#thankyou') )
    app.get('/verified', (req,res) => res.redirect('/#verified') )
    app.get('/forgot', (req,res) => res.redirect('/#forgotpass') )
    app.get('/resetpass', (req,res) => res.redirect('/#newpass') )

    app.get('/register', (req,res) => res.redirect('/#register') )
    app.post('/register', (req,res) => {
        let firstname = req.fields.first_name || '',
        lastname = req.fields.last_name || '',
        email = req.fields.email || '',
        password = req.fields.password

        refill = function() {
            req.flash('firstname',firstname)
            req.flash('lastname',lastname)
            req.flash('email',email)
            res.redirect('/#register')
        }

        if(!req.fields.checkbox) {
            req.flash('registerError','Please agree to the terms of service')
            return refill()
        }

        if(!email.includes('@students.ecu.edu')) {
            req.flash('registerError','Please use your ECU student email!')
            return refill()
        }

        if(password != req.fields.password_confirm) {
            req.flash('registerError','Your passwords do not match')
            return refill()
        }
        
        if(firstname != "" || lastname != "" || email != "" || password != "") {
            register(firstname, lastname, email, password)
            .then((id) => {
                if(id) {
                    sendVerificationEmail(email)
                    res.redirect('/thankyou')
                } else {
                    req.flash('registerError',"Your account could not be created!")
                    return refill()
                }
            })
            .catch( err => {
                if(err.errno === 1062) {
                    req.flash('registerError',"Someone is already regsitered with this email")
                    return refill()
                }
                req.flash('registerError',JSON.stringify(err))
                return refill()
            })
        } else {
            req.flash('registerError','Missing information')
            return refill()
        }
    })

    app.get('/post',(req,res) => res.redirect('/') )
    app.post('/post', (req, res) => {
        if(req.isAuthenticated()) {
            let fileArr = []
            if(req.files.fileAttachments.length)
                fileArr = req.files.fileAttachments
            else fileArr = [req.files.fileAttachments]
            numFiles = fileArr.length

            let FileTooBig = false
            fileArr.forEach( (file,i) => {
                if(file.size == 0 || file.name == '')
                setTimeout(() => fs.unlinkSync(fileArr.splice(i,1)[0].path), 3000)
                if(file.size > 10000000)
                    stop = true
            } )

            if(FileTooBig) {
                req.flash('error','The file was too big (10M max)')
                res.redirect('/')
            } else if(fileArr.length > 5) {
                req.flash('error','Too many files (5 files max)')
                res.redirect('/')
            } else
                createPost(req.user.id,req.fields.course,req.fields.post_text,fileArr)
                .then(() => res.redirect('/'))
        } else {
            referenceLink = req.url
            res.redirect('/')
        }
    })

    app.get('/infolog', (req,res) => {
        if(req.isAuthenticated() && (req.user.acc_type == 'admin' || req.user.acc_type == 'mod'))
            data = JSON.stringify(req.user,null,4)
        else data = "You are not authorized to view this data"
        res.set('Content-Type', 'application/json')
        res.send(data)
    })
    
    app.get('/logout', (req, res) => {
        if(req.isAuthenticated())
            req.logout()
        res.redirect('/')
    })

    // Passport Session Serialization

    pp.serializeUser((user, done) => done(null, user) )
    
    pp.deserializeUser((id, done) => getUserByID(id).then( result => done(null, result) ).catch( err => console.log(err) ))
}