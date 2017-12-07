/*
    @author Joe Williams
    Software Engineering : East Carolina University
    PirateNotes

    email.js - handles on communication of the web server to the mail server.

*/
let nodemailer = require('nodemailer')

module.exports = (db) => {

    // sets default mail settings
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        secure: false,
        port: 25,
        auth: {
            user: 'no.reply.piratenotes@gmail.com',
            pass: 'AsDf1234'
            // Disposable Test Account
        },
        tls: {
            rejectUnauthorized: false
        }
    })

    // sets default mail params
    let mailOptions = {
        from: '"Pirate Notes" <no.reply.piratenotes@gmail.com>',
        to: 'no.reply.piratenotes@gmail.com'
    }

    // send the password email to the user
    sendPasswordEmail = (user_email,code,callback) => {
        mailOptions.subject = 'PirateNotes - Forgot password'
        mailOptions.to = user_email
        db.query('select * from user where email = ?',[user_email])
        .then( (result) => {
            user = result[0]
            mailOptions.html = 
            `<html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width" />
            </head>
            <body style="margin:0;margin-top:20px;padding:0;">
                <div style="margin:0 auto;max-width:600px;text-align:center;">
                    <h1 style="color:#592A8A;font-family:'Arial';margin:0;">
                    Notification from PirateNotes!</h1>
                    <center><img src="https://github.com/BubbaJoe/SE-PirateNotes/blob/master/public/images/ECU_department.jpg?raw=true" 
                    style="display: block;max-width: 25%;padding: 12px 0;"alt="ECU Pirate" /></center>
                    <br><p style="color: #592A8A;font-family: 'Arial';margin: 0;">
                    Hello ${user.firstname} ${user.lastname}, Did you forget your password?
                    </p><br>
                    <p style="color: #592A8A;font-family: 'Arial';margin: 0;">
                    Follow the link and enter the verification email to reset your password.</p>
                    <p style="font-size:34px">${code}</p>
                    <br><a href="http://localhost:8080/resetpass">Click me!!!</a>
                    <br>
                    <br>
                    <p style="color: #592A8A;font-family: 'Arial';margin: 0;">If you did request a password reset, simply ignore this e-mail. </p>
                </div>
            </body>
            <html>`
            
            transporter.sendMail(mailOptions, (err,info) => {
                if(err) console.log(err)
                else if(callback)
                return callback(user)
                else return callback()
            })
        })
        .catch(err => console.log("Couldn't send email",err))
    }

    // sends a verication email to user
    sendVerificationEmail = (user_email,callback) => {
        mailOptions.subject = 'PirateNotes - Verify Account'
        mailOptions.to = user_email
        db.query('select * from user where email = ?',[user_email])
        .then( (result) => {
            user = result[0]
            mailOptions.html =
            `<html>
                <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width" />
                </head>
                <body style="margin:0;margin-top:20px;padding:0;">
                    <div style="margin:0 auto;max-width:600px;text-align:center;">
                        <h1 style="color:#592A8A;font-family:'Arial';margin:0;">
                        Thank you for joining PirateNotes!</h1>
                        <center><img src="https://github.com/BubbaJoe/SE-PirateNotes/blob/master/public/images/ECU_department.jpg?raw=true" 
                        style="display: block;max-width: 25%;padding: 12px 0;"alt="ECU Pirate" /></center>
                        <br><p style="color: #592A8A;font-family: 'Arial';margin: 0;">
                        Hello ${user.firstname} ${user.lastname}, we the crew at PirateNotes would like to thank you for joining our community. Make sure you read up on our <a href="http://localhost:8080/tos">Terms of Service</a> to make sure you are following the rules. We would also like you to share this with your friend to help the community grow!
                        </p><br>
                        <p style="color: #592A8A;font-family: 'Arial';margin: 0;">
                        Follow this link to verify your account:</p>
                        <br><a href="http://localhost:8080/verify/${user.id}">Click me!!!</a>
                        <br>
                        <br>
                        <p style="color: #592A8A;font-family: 'Arial';margin: 0;">If you did not request access to this service, simply ignore this e-mail. </p>
                    </div>
                </body>
            <html>`
            
            transporter.sendMail(mailOptions, (err,info) => {
                if(err) console.log(err)
                else return callback(user)
            })
        }).catch(err => console.log("Couldn't send email"))
    }
}
