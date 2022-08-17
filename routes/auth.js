const express = require('express');
const passport = require('passport');
const router = express.Router()

// @desc Auth with Google
// @Route GET /auth/google
router.get('/google', passport.authenticate('google', { scope: ['profile'] }));

// @desc Google Auth Callback 
// @Route GET /auth/google/callback
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/'}), (req, res) => {
    res.redirect('/dashboard');
});
// if login is successful then go to dashboard if not go to the login page
// failureRedirect is the url that we want to redirect the user to if they fail to authenticate which in this case is the login page


// @desc Logout
// @Route GET /auth/logout
// the most current version of Passport needs the logout to be asynchronous
router.get('/logout', (req, res) => {
    req.logout(function(err) {
        if (err) { return next (err)}
        res.redirect('/');
    })
});

module.exports = router