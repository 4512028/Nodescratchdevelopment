const User = require("../models/userModel");
const asyncErrorHandler = require("../middlewares/asyncErrorHandler");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const {
  sendConfirmationEmail,
  ForgetPasswordEmail,
} = require("../utils/sendEmail");
const { createToken, genrateRendomePassword } = require("../utils/helper");

const saltRounds = 10;

// Register User
exports.registerUser = asyncErrorHandler(async (req, res, next) => {
  try {
    const { firstname, lastname, address, phone, email, password } = req.body;

    // Check if a user with the given email already exists
    const user = await User.findOne({ email });

    if (user) {
      if (user.status == "Pending") {
        console.log(user);
        sendConfirmationEmail(
          user.firstName,
          user.email,
          user.confirmationCode
        );
        res.status(201).json({ message: "Please verify your email" });
      } else if (user.status == "Active") {
        res
          .status(409)
          .json({ message: "User with this email already exists." });
      }
    } else {
      const newUser = new User({
        firstName: firstname,
        lastName: lastname,
        address,
        phone,
        email,
        password: hashedPassword,
        confirmationCode: createToken(),
      });

      // Save the new user to the database
      await newUser.save();

      sendConfirmationEmail(
        newUser.firstName,
        newUser.email,
        newUser.confirmationCode
      );

      res.status(201).json({ message: "Please verify your email" });
    }
  } catch (error) {
    console.error("Error while signing up:", error);
    res.status(500).json({ error: "An error occurred" });
  }
});

exports.signin = (req, res) => {
  User.findOne({
    email: req.body.email,
  })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      if (user.status != "Active") {
        return res.status(401).send({
          message: "Pending Account. Please Verify Your Email!",
        });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!",
        });
      }

      var token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: 86400, // 24 hours
      });
      res.status(200).send({
        id: user._id,
        username: user.firstName,
        email: user.email,
        accessToken: token,
      });
    })
    .catch((error) => {
      // Handle any errors that occurred during the query
      console.error(error);
      res.status(500).send({ message: err });
      return;
    });
};

// Send verification email
function sendVerificationEmail(email, verificationToken) {
  // Configure nodemailer transporter for sending emails
  const transporter = nodemailer.createTransport({
    // Configure your email service provider settings
    // See nodemailer documentation for details
  });

  // Compose the email message
  const mailOptions = {
    from: "your-email@example.com",
    to: email,
    subject: "Email Verification",
    text: `Click the following link to verify your email: http://your-app.com/verify/${verificationToken}`,
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending verification email:", error);
    } else {
      console.log("Verification email sent:", info.response);
    }
  });
}

exports.verifyUser = (req, res, next) => {
  User.findOne({
    email: req.body.email,
    confirmationCode: req.body.confirmationCode,
  })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      user.status = "Active";
      return user.save(); // Returning the Promise
    })
    .then(() => {
      res.status(202).send({ status: "email verified" });
    })
    .catch((err) => {
      res.status(500).send({ message: err });
    });
};

exports.resetPassword = (req, res, next) => {
  User.findOne({
    email: req.body.email,
  })
    .then(async (user) => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      const salt = await bcrypt.genSalt(saltRounds);
      const hashedPassword = await bcrypt.hash(req.body.newPassword, salt);
      user.password = hashedPassword;
      user.save(); // Returning the Promise
      res.status(202).send({ status: "PasswordReset" });
    })
    .catch((err) => {
      res.status(500).send({ message: err });
    });
};
exports.forgetPassword = (req, res, next) => {
  User.findOne({
    email: req.body.email,
  })
    .then(async (user) => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }
      let newPAssword = genrateRendomePassword();

      ForgetPasswordEmail(user.firstName, user.email, newPAssword);
      const salt = await bcrypt.genSalt(saltRounds);
      const hashedPassword = await bcrypt.hash(newPAssword, salt);
      user.password = hashedPassword;
      user.save(); // Returning the Promise
      res.status(201).json({ message: "forgot password email send " });
    })
    .catch((err) => {
      res.status(500).send({ message: err });
    });
};
