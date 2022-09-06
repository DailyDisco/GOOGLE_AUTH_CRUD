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

// @desc Show single story
// @Route GET /stories/:id
router.get('/:id', ensureAuth, async (req, res) => {
    try {
        // get the story and check if the story exists
        // add the user info to the story
        let story = await Story.findById(req.params.id).populate('user').lean()

        if (!story) {
            return res.render('error/404')
        }

        res.render('stories/show', {
            // pass in the story Object
            story,
        })
    } catch (error) {
        console.error(err)
        res.render('error/404')
    }
})

// @desc Show edit page
// @Route GET /stories/edit/:id
router.get('/edit/:id', ensureAuth, async (req, res) => {
    try{
    const story = await Story.findOne({
        _id: req.params.id
    }).lean()
    // we are checking to see if the story exists
    if (!story) {
        return res.render('error/404')
    }
    // if the logged in user is not the user then return the public stories
    if (story.user != req.user.id) {
        res.redirect('/stories')
    } else {
        res.render('stories/edit', {
            story,
        })
    }
    } catch (error) {
        console.error(err)
        return res.render('error/500')
    }
})

// @desc Update story
// @Route PUT /stories/:id
router.put('/:id', ensureAuth, async (req, res) => {
    try{
    let story = await Story.findById(req.params.id).lean()
    // we are checking to see if the story exists
    if (!story) {
        return res.render('error/404')
    }
    // if the logged in user is not the user then return the public stories
    if (story.user != req.user.id) {
        res.redirect('/stories')
    }
    else {
        story = await Story.findOneAndUpdate({ _id: req.params.id }, req.body, {
            new: true,
            runValidators: true
        })
        res.redirect('/dashboard')
        }
    } catch (error) {
        console.error(err)
        return res.render('error/500')
    }
})

// @desc Delete story
// @Route DELETE /stories/:id
router.delete('/:id', ensureAuth, async (req, res) => {
    try {
        await Story.remove({ _id: req.params.id })
        res.redirect('/dashboard')
    } catch (error) {
        console.error(err)
        return res.render('error/500')
    }
})

// @desc Particular user stories
// @Route GET /stories/add
router.get('/user/:userId', ensureAuth, async (req, res) => {
   try {
     const stories = await Story.find({
         user: req.params.userId,
         // only get the public stories
         status: 'public'
        })
        .populate('user')
        .lean()

        res.render('stories/index', {
            stories,
        })
   } catch (error) {
         console.error(err)
         res.render('error/500')
   }
})


module.exports = router