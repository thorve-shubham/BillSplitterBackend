const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.emailPassword
    }
});

async function sendMail(to,subject,msg){

    let html = "<h3>Bill Splitter Update : </h3><br/>"+msg+"<br/>Thanks...<br/><br/>Bill Splitter Team";

    const mailOptions = {
        from: process.env.EMAIL,
        to: to,
        subject: subject,
        html : html
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          winstonLogger.error("Sending mail failed");
          return false;
        } else {
          winstonLogger.info("Mail sent sunccessfully");
          return true;
        }
    });
}

module.exports.sendMail = sendMail;