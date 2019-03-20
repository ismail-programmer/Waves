const mailer = require('nodemailer');
const { welcome } = require('./welcomeTemplate');
const { resetPass } = require('./resetPassTemplate');
require('dotenv').config();

const getEmailData = (to, name, token, template, actiondata) => {
  let data = null;

  switch (template) {
    case 'welcome':
      data = {
        from: 'Waves <messagecenterwaves@gmail.com>',
        to,
        subject: `Welcome to waves ${name}`,
        html: welcome()
      };
      break;
    case 'reset_password':
      data = {
        from: 'Waves <messagecenterwaves@gmail.com>',
        to,
        subject: `Hey ${name} reset your password`,
        html: resetPass(actiondata)
      };
      break;
    default:
      data;
  }

  return data;
};

const sendEmail = (to, name, token, type, actiondata = null) => {
  const smtpTransport = mailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'messagecenterwaves@gmail.com',
      pass: process.env.EMAIL_PASS
    }
  });

  const mail = getEmailData(to, name, token, type, actiondata);

  smtpTransport.sendMail(mail, function(err, response) {
    if (err) {
      console.log(err);
    } else {
      console.log('email sent');
    }
    smtpTransport.close();
  });
};

module.exports = { sendEmail };
