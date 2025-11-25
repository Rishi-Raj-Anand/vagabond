const express = require('express')
const router = express.Router({ mergeParams: true });
const ExpressError = require('../utils/ExpressError')
const asyncWrap = require('../utils/asyncWrap.js')

const { isLoggedin,isReviewAuthor,validateReview } = require('../middlewares.js')
const {postReview,deleteReview}=require('../controllers/review.js')


router.post("/", isLoggedin, validateReview, asyncWrap(postReview))

router.delete('/:rid', isLoggedin,isReviewAuthor, asyncWrap(deleteReview))

module.exports = router;