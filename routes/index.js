const express = require('express');
const router = express.Router()
// we are about to destructure; that means we are going to bring in a list of things from a place
const { ensureAuth, ensureGuest } = require('../middleware/auth');
// we are reusing ensureAuth and ensureGuest from the middleware folder so that people who are not logged in will get kicked out

const Story = require('../models/Story');

// @desc Login/Landing page
// @Route GET /
router.get('/', ensureGuest, (req, res) => {
    // instead of just sending text we want to render a page
    res.render('login', {
    layout: 'login',
    })
})

// @desc Dashboard 
// @Route GET /dashboard
router.get('/dashboard', ensureAuth, async (req, res) => {
    try {
        const stories = await Story.find({ user: req.user.id }).lean() // lean is a mongoose method that returns a plain javascript object
        res.render('Dashboard', {
            name: req.user.firstName,
            stories
        })
    } catch (err) {
        console.error(err)
        res.render('error/500')
    }
})

module.exports = router