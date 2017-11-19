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
        },
        tls: {
            rejectUnauthorized: false
        }
    })

    mailOptions = {
        from: '"Pirate Notes" <no.reply.piratenotes@gmail.com>', // static
        to: 'no.reply.piratenotes@gmail.com',
        subject: 'Hello',
        html: '<h1>Hello</h1>',
        text: 'Hello!'
    }

    sendEmail = (user_email,callback) => {
        // Check db to see if user is verified
        console.log('sending email')
        //mailOptions.to = user_email
        
        transporter.sendMail(mailOptions, (err,info) => {
            if(err) console.log(err)
            else return callback(info)
            return
        })
    }

    sendMassEmail = (email_arr,callback) => {

        //mailOptions.to = email_arr

        transporter.sendMail(mailOptions, (err,info) => {
            if(err) console.log(err)
            else return callback(info)
            return
        })
    }
}