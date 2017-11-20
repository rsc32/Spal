var EM = {};

var nodemailer = require('nodemailer');

EM.transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'a.walker3219@gmail.com',
        pass: 'ForHelpC++'
    }
});

EM.dispatchResetPasswordLink = function (user, callback) {
    var mailOptions = {
        from: 'My Smart Pal Support <do-not-reply@gmail.com>',
        to: user.email,
        subject: 'Password Reset',
        text: '',
        html: EM.composeResetEmail(user)
    };
    EM.transporter.sendMail(mailOptions, function (error, info) {
        callback(error, info)
    });
};

EM.dispatchVerifyEmail = function (user, callback) {
    var mailOptions = {
        from: 'My Smart Pal Support <do-not-reply@gmail.com>',
        to: user.email,
        subject: 'Welcome to My Smart Pal, please verify your email!',
        text: '',
        html: EM.composeVerifyEmail(user)
    };
    EM.transporter.sendMail(mailOptions, function (error, info) {
        callback(error, info)
    });
};

EM.composeResetEmail = function (user) {
    var link = 'http://localhost:3000/reset-password?o=' + user.email + '&j=' + user.password;
    var html = "<html><body>";
    html += "Hi " + user.first + " " + user.last + ",<br><br>";
    html += "Your username is <b>" + user.username + "</b><br><br>";
    html += "<a href='" + link + "'>Click here to reset your password</a><br><br>";
    html += "</body></html>";
    return html;
};

EM.composeVerifyEmail = function (user) {
    var link = 'http://localhost:3000/verify?c=' + user.verificationCode;
    var html = "<html><body>";
    html += "Hi " + user.first + " " + user.last + ",<br><br>";
    html += "Your username is <b>" + user.username + "</b><br><br>";
    html += "<a href='" + link + "'>Click here to verify your email</a><br><br>";
    html += "</body></html>";
    return html;
};

module.exports = EM;