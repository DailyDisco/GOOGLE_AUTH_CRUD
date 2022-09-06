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

// @desc Process add form
// @Route POST /stories
router.post('/', ensureAuth, async (req, res) => {
    try {
        req.body.user = req.user.id
        await Story.create(req.body)
        res.redirect('/dashboard')
    } catch (error) {
        console.error(err)
        res.render('error/500')
    }
})

// @desc Show all stories
// @Route GET /stories/add
router.get('/', ensureAuth, async (req, res) => {
    // instead of just sending text we want to render a page
    try {
        const stories = await Story.find({ status: 'public' })
            .populate('user')
            .sort({ createdAt: 'desc' })
            .lean()
            res.render('stories/index', {
                stories,
            })
    } catch (error) {
        console.error(err)
        res.render('error/500')
    }
})

// @desc Show edit page
// @Route GET /stories/edit/:id
router.get('/edit/:id', ensureAuth, (req, res) => {
    // instead of just sending text we want to render a page
    res.render('stories/add')
})

module.exports = router