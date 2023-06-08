const express = require("express");
const {
  registerUser,
  signin,
  verifyUser,
  resetPassword,
  forgetPassword,
} = require("../controllers/userController");

const router = express.Router();
router.route("/register").post(registerUser);
router.route("/signIn").post(signin);
router.route("/verifyUser").put(verifyUser);
router.route("/resetPassword").put(resetPassword);
router.route("/forgetPassword").put(forgetPassword);

module.exports = router;
