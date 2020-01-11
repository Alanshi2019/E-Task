const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: "alanshi1110@gmail.com",
    subject: "Thanks for joining in!",
    text: `Welcome to the app, ${name}, Let me know how you get along with the app.`
  });
};

const sendCancelEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: "alanshi1110@gmail.com",
    subject: "We'll miss you!",
    text: `Goodbye, ${name}. We hope to see you back sometime soon.`
  });
};

module.exports = {
  sendWelcomeEmail,
  sendCancelEmail
};
