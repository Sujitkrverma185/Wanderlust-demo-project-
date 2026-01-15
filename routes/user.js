const express = require("express");
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const router = express.Router();
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");

const usersController = require("../controllers/users.js");

//signup route
router.route("/signup")
.get(usersController.renderSignupForm)
.post(wrapAsync( usersController.sinupForm));

//login route
router.route("/login")
.get(usersController.renderLoginForm)
.post(saveRedirectUrl,
    passport.authenticate("local",{
        failureRedirect : "/login",
        failureFlash : true,
    }),
    usersController.loginForm
);

//logout
router.get("/logout", usersController.logout);

module.exports = router;