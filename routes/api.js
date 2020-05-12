const express = require('express')
const router = express.Router()
const Score = require('../models/score.js')

router.get('/score', function(_, res, next) {
  Score.find({}, function(err, result) {
    if (err) {
      next(err)
    } else {
      return res.send(result);
    }
  })
})

router.post('/score/add', function(req, res, next) {
  const q = new Score({ score: req.body.score, user: req.session.username })
  if(req.session.username) {
    q.save(function(err) {
      if (!err) {
        return res.send({ success: 'OK' });
      } else {
        next(err);
      }
    })
  }
})

module.exports = router
