const transport = require("../config/nodemailer.config");

const sendConfirmationEmail = (name, email, confirmationCode) => {
  console.log("Check", "c");

  transport
    .sendMail({
      from: process.env.USER,
      to: email,
      subject: "Please confirm your account",
      html: `<h1>Email Confirmation</h1>
        <h2>Hello ${name}</h2>
        <p>Thank you for subscribing. Please confirm your email by clicking on the following link</p>
          <p>${confirmationCode}</p>
         </div>`,
    })
    .catch((err) => console.log(err));
};
const ForgetPasswordEmail = (name, email, password) => {
  console.log("Check", "c");

  transport
    .sendMail({
      from: process.env.USER,
      to: email,
      subject: "Your new password",
      html: `<h1>Email Confirmation</h1>
        <h2>Hello ${name}</h2>
        <p>Dear {{firstName}},

We received a request to reset the password for your account. If you did not initiate this request, please disregard this email.

To reset your password, click on the link below:

{{resetLink}}

If the above link doesn't work, copy and paste the following URL into your browser:

{{resetLink}}

Please note that this link is valid for 24 hours. After that, you'll need to request another password reset.

If you have any questions or need further assistance, please don't hesitate to contact our support team at support@example.com.
</p>
          <p>Your New  Password ${password}</p>
         </div>`,
    })
    .catch((err) => console.log(err));
};
module.exports = { sendConfirmationEmail, ForgetPasswordEmail };
