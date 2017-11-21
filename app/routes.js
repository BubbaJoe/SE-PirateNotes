/*

    @author Joe Williams
    Software Engineering: East Carolina University
    PirateNotes

    routes.js - To configure the server endpoints or 'routes'.

*/

let fs = require('fs')
let path = require('path')

// referenceLink = [user.ip, (the last link they requested before session was lost) ]
let referenceLink = []
let verifyId = []

// Express, Socket.IO, MySQL, NodeMailer and Passport
module.exports = (app, io, db, nm, pp) => {

    // Maybe turned into a web socket for faster communication
    app.get('/follow_course/:cid', (req,res) => {
        // follow course
        if(req.isAuthenticated()) {
        }
    })

    // Maybe turned into a web socket for faster communication
    app.get('/follow_department/:did', (req,res) => {
        // follow department
        if(req.isAuthenticated()) {
        }
    })

    app.post('/forgot', (req,res) => {
        //only for forgotten passwords
    })

    app.post('/password', (req,res) => {
        //only for forgotten passwords
    })

    app.get('/tos', (req,res) => {
        // send tos doc
    })

    app.get('/verify/:uid', (req,res) => {
        // 3 cases!
        // The user id is not found, "User not found"
        // The user is already verified, "You are already verified"
        // The user verifies their self, "You have verified yourself click here to log in"
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
            getDepartmentCourses(req.params.did)
            .then( (_courses) => {
                    res.render('department',{
                        user: req.user,
                        department: department,
                        courses: courses,
                        _courses: _courses
                    })
                    req.login(req.user.id,()=>{})
                }
            )))
        }
    })

    app.get('/audit', (req,res) => {
        if(req.isAuthenticated()) {
            if (req.user.acc_type == 'admin' || req.user.acc_type == 'mod') {
                res.render("audit",{
                    user: req.user
                })
                req.login(req.user.id,()=>{})
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
            .then(() => getCourse( course_id )
            .then( results => course = results )
            .then( () => getUserCourses( req.user.id )
            .then( results => courses = results ))
            .then(() => {
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
                path = './temp_uploads/' + (f.file_name || '')
                if(f) fs.writeFile(path, f.file_data, (err) => res.download(path) )
                setTimeout(() => fs.unlinkSync(path), 3000)
            })
        } else {
            referenceLink[req.ip] = req.url
            res.redirect('/')
            return
        }
    })

    app.get('/search', function (req,res) {
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

    app.post('/search', function (req,res) {
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

    app.get('/profile_image/:uid', (req,res) => {
        uid = req.params.uid
        if(req.isAuthenticated())
            getProfilePictureByID(uid,(result) => {
                if(result.profile_image) {
                    res.setHeader('Content-disposition', 'attachment filename=profile.svg')
                    res.send(result.profile_image)
                } else res.status(404).end()
            })
    })
    
    app.get('/', (req,res) => {
        if(req.isAuthenticated() && referenceLink[req.ip]) {
            res.redirect(referenceLink[req.ip])
            delete referenceLink[req.ip]
        } else if(req.isAuthenticated()) {
            let courses = [], departments, myPosts = [], interests = [], notifications = [], savedPosts = []
            getUserCourses( req.user.id ).then( results => courses = results )
            .then(() => getUserPosts( req.user.id )
            .then( results => myPosts = results )
            .then( () => getUserDepartments( req.user.id )
            .then( (depts) => departments = depts ))
            // .then(() => getUserSavedPosts( req.user.id )
            // .then( results => savedPosts = results )
            // .then(() => getUserNotifications( req.user.id )
            // .then( results => Notifications = results )
            .then(() => {
                res.render('home', {
                    user: req.user,
                    courses: courses,
                    departments: departments,
                    myPosts: myPosts,
                    savedPosts: savedPosts,
                    notifications: notifications
                })
                req.login(req.user.id,()=>{})
            })
            )
        } else {
            req.flash('danger','incorrect information')
            res.render('auth', {
                messages: req.flash('INCORRECT INFO') 
            })
        }
    })
    
    app.get('/login',(req,res) => res.redirect('/') )
    app.post('/login', (req, res) => {
        let email = req.fields.email,
        password = req.fields.password
        login(email,password)
        .then( result => {
            if(result) {
                id = result.id
                req.login(id, (err) => {
                    if(err)console.log(err)
                    console.log('...')
                    res.redirect('/')
                })
            } else {
                req.flash('alert alert-danger',
                    '<b>Sorry!</b> Incorrect login information.')
                res.redirect('/',{ message: req.flash('Incorrect login information') })
            }
        })
    })

    app.get('/register', (req,res) => res.redirect('/') )
    app.post('/register', (req,res) => {
        let firstname = req.fields.first_name || '',
        lastname = req.fields.last_name || '',
        email = req.fields.email || '',
        password = req.fields.password || ''
        
        if(!email || email.includes('@students.ecu.edu')) {
            req.flash('You need to you use ECU student email to register')
            res.redirect('/')
        } else console.log("email usable")

        // validate here
        if(firstname != "" || lastname != "" || email != "" || password != "") {
            register(firstname, lastname, email, password)
            .then((id) => {
                if(id) {
                    sendEmail(email,() => res.redirect('/') )
                } else {
                    req.flash('alert alert-danger','Incorrect login information.')
                    res.redirect('/')
                }
            }) 
        } else {
            req.flash('alert alert-danger','Missing information')
            res.redirect('/')
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
                    fs.unlinkSync(fileArr.splice(i,1)[0].path)
                if(file.size > 10000000)
                    stop = true
            } )

            if(FileTooBig) {
                req.flash('The file was too big (10M max)')
                res.redirect('/')
            } else if(fileArr.length > 5) {
                req.flash('Too many files (5 files max)')
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

    pp.serializeUser((user, done) => done(null, user) )
    
    pp.deserializeUser((id, done) => getUserByID(id).then( result => done(null, result) ).catch( err => console.log(err) ))
}
