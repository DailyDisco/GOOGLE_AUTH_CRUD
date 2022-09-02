const express = require('express');
const router = express.Router()
// we are about to destructure; that means we are going to bring in a list of things from a place
const { ensureAuth } = require('../middleware/auth');
// we are reusing ensureAuth and ensureGuest from the middleware folder so that people who are not logged in will get kicked out

const Story = require('../models/Story');

// @desc Show add page
// @Route GET /stories/add
router.get('/add', ensureAuth, (req, res) => {
    // instead of just sending text we want to render a page
    res.render('stories/add')
})

module.exports = router