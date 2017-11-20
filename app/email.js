/*
    @author Joe Williams
    Software Engineering : East Carolina University
    PirateNotes

    email.js - handles on communication of the web server to the mail server.

*/

module.exports = (nodemailer, db) => {

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

    mailOptions = {
        from: '"Pirate Notes" <no.reply.piratenotes@gmail.com>',
        to: 'no.reply.piratenotes@gmail.com',
        subject: 'PirateNotes - Verify Account',
    }

    sendEmail = (user_email,callback) => {
        let user = {}
        db.query('select * from user where email = ?',[user_email])
        .then( (result) => user = result[0] )
        .then(() => {
            //mailOptions.to = user_email
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
            <br><a href="http://localhost:8080/verify/${user.id}">Verify My Account</a><br>
            Or try this link
            <br>http://localhost:8080/verify/${user.id}<br>
            <p style="color: #592A8A;font-family: 'Arial';margin: 0;">If you did not request access to this service, simply ignore this e-mail. </p>
        </div>
    </body>
<html>`
            
            transporter.sendMail(mailOptions, (err,info) => {
                if(err) console.log(err)
                else return callback(info)
            })
        })
    }

    sendMassEmail = (email_arr,callback) => {

        //mailOptions.to = email_arr
        transporter.sendMail(mailOptions, (err,info) => {
            if(err) console.log(err)
            else return callback(info)
        })
    }
}