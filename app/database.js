/*
    @author Joe Williams
    Software Engineering : East Carolina University
    PirateNotes

    database.js - handles on communication of the web server to the database.
    
*/

let fs 			= require('fs')
let uuid		= require('uuid/v4')
let bcrypt		= require('bcrypt-nodejs')

module.exports = (db) => {

    // Create uuid for the IDs of each table
    createUuid = () => {
        let id = uuid()
        while(id.includes('-'))
            id = id.replace('-','')
        return id
    }

    // Runs a custom query
    runQuery = (query,params) => {
        return new Promise( ( resolve, reject ) => {
            db.query(query, params)
            .then( result =>  resolve(result) )
            .catch( err => console.log(err) )
        } )
    }

    // Get all user data
    getUserByID = (id) => {
        return new Promise( ( resolve, reject ) => {
            db.query('select * from user where id = ?', [id])
            .then( result => resolve(result[0]) )
            .catch( err => console.log(err) )
        } )
    }

    // Get user profile image
    getProfilePictureByID = (id) => {
        return new Promise( ( resolve, reject ) => {
            db.query('select profile_image from user where id = ?', [id])
            .then( result =>  resolve(result[0]) )
            .catch( err => console.log(err) )
        } )
    }

    // Upload profile picture
    updateProfileImage = (id,filedata) => {
        return new Promise( ( resolve, reject ) => {
            path = './temp_uploads/' + (f.file_name || 'temp_file'+ Math.round(Math.random()*10000) )
            fs.readFile(file.path, (err, data) =>
                db.query('update user set profile_image = ? where id = ?', 
                [data, id] ).then( result => resolve(result[0]) )
                .then( () => fs.unlink(path, () => {} ) )
                .catch( err => console.log(err) )
            )
        } )
    }

    // Update p
    updateUserName = (id,firstname,lastname) => {
        return new Promise( ( resolve, reject ) => {
            db.query('update user set firstname = ?, lastname = ? where id = ?', 
            [firstname, lastname, id] )
            .then( result =>  resolve() )
            .catch( err => console.log(err) )
        } )
    }

    updateUserGender = (id,gender) => {
        return new Promise( ( resolve, reject ) => {
            db.query('update user set gender = ? where id = ?', 
            [gender, id] )
            .then( result =>  resolve() )
            .catch( err => console.log(err) )
        } )
    }

    updateUserMajor = (id,major) => {
        return new Promise( ( resolve, reject ) => {
            db.query('update user set major = ? where id = ?', 
            [major, id] )
            .then( result =>  resolve() )
            .catch( err => console.log(err) )
        } )
    }

    updateUserInterests = (id,interests) => {
        return new Promise( ( resolve, reject ) => {
            db.query('update user set interests = ? where id = ?', 
            [interests,id])
            .then( result =>  resolve() )
            .catch( err => console.log(err) )
        } )
    }

    updateUserPassword = (id,password) => {
        return new Promise( ( resolve, reject ) => {
            db.query('update user set password = ? where id = ?', 
            [bcrypt.hashSync(password),id])
            .then( result =>  resolve() )
            .catch( err => console.log(err) )
        } )
    }

    updateProfileDesc = (id,profile_desc) => {
        return new Promise( ( resolve, reject ) => {
            db.query('update user set profile_desc = ? where id = ?', 
            [profile_desc,id])
            .then( result =>  resolve() )
            .catch( err => console.log(err) )
        } )
    }

    // Create post
    createPost = (user_id,course_id,post_text,fileArr) => {
        let post_id = createUuid()
        return new Promise( ( resolve, reject ) => {
            db.query('insert into post (id,user_id,course_id,post_text,post_date,post_status) values (?,?,?,?,?,?)',
            [post_id,user_id,course_id,post_text,new Date().toLocaleString(),'pending'])
            .then( () => 
                    resolve(fileArr.forEach( file => 
                    fs.readFile(file.path, (err,data) => 
                        db.query('insert into file(id,post_id,file_name,file_size,file_type,file_data) values(?,?,?,?,?,?)',
                        [createUuid(),post_id,file.name,file.size,file.type,data])
                        .then ( () => fs.unlinkSync(file.path) )
                        .catch( err => {
                            console.log(err.code)
                            fs.unlinkSync(file.path)
                        } )
                    )
                ))
            ).catch( err => console.log(err))
        } )
    }

    // Get data from a file with file id
    getFile = (file_id) => {
        return new Promise( ( resolve, reject ) => {
            db.query('select * from file'+
            ' where id = ?',[file_id])
            .then( result => resolve(result[0]))
            .catch( err => console.log(err))
        } )
    }
    
    // Gets interests of the user
    getUserInterests = (user_id) => {
        return new Promise( ( resolve, reject ) => {
            db.query('select interests from user'+
            ' where id = ?',[user_id])
            .then( result => resolve(result[0]))
            .catch( err => console.log(err))
        } )
    }

    // get the courses that the user is following
    getUserCourses = (user_id) => {
        return new Promise( ( resolve, reject ) => {
            db.query('select * from course, (select' +
            ' * from followed_course where user_id = ?) c ' +
            'where course.id = c.course_id', [user_id])
            .then( result => resolve(result))
            .catch( err => console.log(err))
        } )
    }

    // get the courses from specifed department
    getDepartmentCourses = (dept_id) => {
        return new Promise( ( resolve, reject ) => {
            db.query('select * from course, (select' +
            ' * from department where id = ?) d' +
            ' where course.dept_abbr = d.dept_abbr', [dept_id])
            .then( result => resolve(result))
            .catch( err => console.log(err))
        } )
    }

    // get the courses that the user is following
    getUserDepartments = (user_id) => {
        return new Promise( ( resolve, reject ) => {
            db.query('select * from department, (select' +
            ' * from followed_department where user_id = ?) c ' +
            'where department.id = c.dept_id', [user_id])
            .then( result => resolve(result))
            .catch( err => console.log(err))
        } )
    }

    // Posts that the user has created that are accepted
    getAcceptedUserPosts = (user_id) => {
        return new Promise( ( resolve, reject ) => {
            db.query('',[])
            .then(result => resolve())
            .catch(err => console.log(err))
        } )
    }

    // Posts for the courses that the user is following
    getUserViewPosts = (user_id) => {
        return new Promise( ( resolve, reject ) => {
            db.query('',[])
            .then(result => resolve())
            .catch(err => console.log(err))
        } )
    }

    // Posts that the user has created that are accepted
    getUserPosts = (user_id) => {
        return new Promise( ( resolve, reject ) => {
            let final_post
            db.query('select post.*, course_name, course_num, dept_abbr, firstname, lastname'+
            ' from post inner join user on user.id = post.user_id inner '+
            'join course on course_id = course.id where user_id = ? order'+
            ' by post_date desc',[user_id])
            .then( posts => db.query('select file.* from file inner join'+ 
                ' post on post_id = post.id inner join user on user_id'+
                ' = user.id where user.id = ?',[user_id])
            .then( files => {
                if(posts.length == 0) return final_post = []
                for(let j = 0; j < posts.length; j++) {
                    posts[j].files = []
                    for(let i = 0; i < files.length; i++) {
                        if(files[i].post_id == posts[j].id) {
                            posts[j].files.push(files[i])
                        }
                    }
                }
                final_post = posts
            }))
            .then( () => resolve(final_post) )
            .catch( err => console.log(err) )
        } )
    }

    // Posts that the user has created that are accepted
    getCoursePosts = (course_id) => {
        return new Promise( ( resolve, reject ) => {
            let final_post
            db.query('select post.*, firstname, lastname from post inner'+
            ' join user on user.id = post.user_id inner join course on course_id'+
            ' = course.id where course_id = ? and post_status = \'accepted\' order by post_date desc', [course_id])
            .then( posts => db.query('select file.* from file inner join'+ 
                ' post on post.id = post_id where course_id = ? ',[course_id])
            .then( files => {
                if(posts.length == 0) return final_post = []
                for(let j = 0; j < posts.length; j++) {
                    posts[j].files = []
                    for(let i = 0; i < files.length; i++) {
                        if(files[i].post_id == posts[j].id) {
                            posts[j].files.push(files[i])
                        }
                    }
                }
                final_post = posts
            }))
            .then(() => resolve(final_post))
            .catch( err => console.log(err) )
        } )
    }

    // Gets the course
    getCourse = (course_id) => {
        return new Promise( ( resolve, reject ) => {
            db.query('select * from course ' +
            'where id = ?', [course_id])
            .then(result => resolve(result[0]))
            .catch(err => console.log(err))
        } )
    }

    // Gets the department
    getDepartment = (dept_id) => {
        return new Promise( ( resolve, reject ) => {
            db.query('select * from department ' +
            'where id = ?', [dept_id])
            .then(result => resolve(result[0]))
            .catch(err => console.log(err))
        } )
    }

    // For admin/mod use only
    // gets all posts pending approval
    getAllPendingPosts = () => {
        return new Promise( ( resolve, reject ) => {
            db.query('select post.*, course_name, course_num, dept_abbr, firstname, lastname'+
            ' from post inner join user on user.id = post.user_id inner '+
            'join course on course_id = course.id where post_status = \'pending\' order by post_date desc')
            .then( posts => db.query('select file.* from file inner join'+ 
                ' post on post_id = post.id inner join user on user_id'+
                ' = user.id')
            .then( files => {
                if(posts.length == 0) return final_post = []
                for(let j = 0; j < posts.length; j++) {
                    posts[j].files = []
                    for(let i = 0; i < files.length; i++) {
                        if(files[i].post_id == posts[j].id) {
                            posts[j].files.push(files[i])
                            //delete files[i]
                            // i --
                        }
                    }
                }
                final_post = posts
            }))
            .then( () => resolve(final_post) )
            .catch( err => console.log(err) )
        } )
    }

    // For admin/mod use only
    // gets all posts
    getAllPosts = () => {
        return new Promise( ( resolve, reject ) => {
            db.query('select post.*, course_name, course_num, dept_abbr, firstname, lastname'+
            ' from post inner join user on user.id = post.user_id inner '+
            'join course on course_id = course.id order by post_date desc')
            .then( posts => db.query('select file.* from file inner join'+ 
                ' post on post_id = post.id inner join user on user_id'+
                ' = user.id')
            .then( files => {
                if(posts.length == 0) return final_post = []
                for(let j = 0; j < posts.length; j++) {
                    posts[j].files = []
                    for(let i = 0; i < files.length; i++) {
                        if(files[i].post_id == posts[j].id) {
                            posts[j].files.push(files[i])
                            //delete files[i]
                            // i --
                        }
                    }
                }
                final_post = posts
            }))
            .then( () => resolve(final_post) )
            .catch( err => console.log(err) )
        } )
    }

    // For admin/mod use only
    // accept this post
    acceptPost = (post_id) => {
        return new Promise( ( resolve, reject ) => {
            db.query('update post set post_status = \'accepted\' where id = ?',[post_id])
            .then(result => resolve())
            .catch(err => console.log(err))
        } )
    }

    // searches for the course
    searchCourse = (word) => {
        return new Promise( ( resolve, reject ) => {
            word = '%' + word + '%';
            db.query('select distinct * from course where course_name like ? or dept_abbr like ? or course_num like ?',
            [word.toLowerCase(), word.toLowerCase(), word.toLowerCase()])
            .then(result => resolve(result))
            .catch(err => console.log(err))
        } )
    }

    // searches  for the department
    searchDepartment = (word) => {
        return new Promise( ( resolve, reject ) => {
            word = '%' + word + '%';
            db.query('select distinct * from department where dept_name like ? or dept_abbr like ?',
            [word.toLowerCase(), word.toLowerCase()])
            .then(result => resolve(result))
            .catch(err => console.log(err))
        } )
    }

    // For admin/mod use only
    // deny this post
    declinePost = (post_id) => {
        return new Promise( ( resolve, reject ) => {
            db.query('update post set post_status = \'denied\' where id = ?',[post_id])
            .then(result => resolve())
            .catch(err => console.log(err))
        } )
    }

    //For admin/mod use only
    // suspends a user from posting
    suspendUser = (user_id,suspend_length) => {
        return new Promise( ( resolve, reject ) => {
            db.query('update user set acc_status = \'warning\' where id = ?',
            [user_id])
            .then(result => resolve())
            .catch(err => console.log(err))
        } )
    }

    // For admin/mod use only
    // bans a user from posting
    banUser = (user_id) => {
        return new Promise( ( resolve, reject ) => {
            db.query('update user set acc_status = \'banned\' where id = ?',
            [user_id])
            .then(result => resolve())
            .catch(err => console.log(err))
        } )
    }

    // Set the user's account to active from unverifed
    verifyUser = (user_id) => {
        return new Promise( ( resolve, reject ) => {
            db.query('update user set acc_status = \'active\' where id = ?',
            [user_id])
            .then(result => resolve())
            .catch(err => console.log(err))
        } )
    }

    // sets user to follow a course
    likePost = (user_id, post_id) => {
        return new Promise( ( resolve, reject ) => {
            db.query('insert into liked (user_id,post_id) values (?, ?)',
            [user_id, post_id])
            .then(result => resolve())
        } )
    }

    // sets user to follow a course
    unlikePost = (user_id,post_id) => {
        return new Promise( ( resolve, reject ) => {
            db.query('delete from liked where user_id = ? and post_id = ?',
            [user_id, post_id])
            .then(result => resolve())
        } )
    }

    // sets user to follow a course
    savePost = (user_id,post_id) => {
        return new Promise( ( resolve, reject ) => {
            db.query('insert into saved (user_id,post_id) values (?, ?)',
            [user_id, post_id])
            .then(result => resolve())
        } )
    }

    // sets user to follow a course
    unsavePost = (user_id,post_id) => {
        return new Promise( ( resolve, reject ) => {
            db.query('delete from saved where user_id = ? and post_id = ?',
            [user_id, post_id])
            .then(result => resolve())
        } )
    }

    // sets user to follow a course
    followDepartment = (user_id,dept_id) => {
        return new Promise( ( resolve, reject ) => {
            db.query('insert into followed_department (user_id,dept_id) values (?, ?)',
            [user_id, dept_id])
            .then(result => resolve())
        } )
    }
    
    // sets user to unfollow a course
    unfollowDepartment = (user_id,dept_id) => {
        return new Promise( ( resolve, reject ) => {
            db.query('delete from followed_department where user_id = ? and dept_id = ?',
            [user_id, dept_id])
            .then(result => resolve())
        } )
    }

    // sets user to follow a course
    followCourse = (user_id,course_id) => {
        return new Promise( ( resolve, reject ) => {
            db.query('insert into followed_course (user_id,course_id) values (?, ?)',
            [user_id, course_id])
            .then(result => resolve())
        } )
    }
    
    // sets user to unfollow a course
    unfollowCourse = (user_id,course_id) => {
        return new Promise( ( resolve, reject ) => {
            db.query('delete from followed_course where user_id = ? and course_id = ?',
            [user_id, course_id])
            .then(result => resolve())
        } )
    }

    // Register User Information
    register = (firstname,lastname,email,password) => {
        let id = createUuid()
        let pw = bcrypt.hashSync(password)
        return new Promise( ( resolve, reject ) => {
            db.query('insert into user(id,firstname,lastname,email,password,acc_type,acc_status) values(?,?,?,?,?,?,?,?)',
            [id,firstname.trim(),lastname.trim(),email.trim(),pw,'general',"unverified"])
            .then( () =>  resolve(id) )
            .catch( err => reject(err) )
        } )
    }

    // Custom register to specify type
    customRegister = (firstname,lastname,email,password,type) => {
        let id = createUuid()
        let pw = bcrypt.hashSync(password)
        return new Promise( ( resolve, reject ) => {
            db.query('insert into user(id,firstname,lastname,email,password,profile_desc,acc_type,acc_status) values(?,?,?,?,?,?,?,?)',
            [id,firstname.trim(),lastname.trim(),email,pw,'',type,"active"])
            .then( () =>  resolve(id) )
            .catch( err => console.log(err) )
        } )
    }

    // Validate the Login information 
    login = (email,password) => {
        return new Promise( ( resolve, reject ) => {
            db.query('select id, password from user where email = ?', [email])
            .then( (result) => {
                if(bcrypt.compareSync(password, result[0].password))
                    resolve(result[0]) 
                else resolve()
            } )
            .catch( (err) => console.log(err) )
        } )
    }
}
