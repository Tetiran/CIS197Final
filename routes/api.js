const express = require('express')
const router = express.Router()
const Score = require('../models/score.js')

router.get('/score', function(_, res, next) {
  Score.find({}, function(err, result) {
    if (err) {
      next(err)
    } else {
      return res.send(result)
    }
  })
})

router.post('/score/add', function(req, res, next) {
  if (req.session.username) {
    const q = new Score({ score: req.body.score, user: req.session.username })
    Score.findOne({ user: req.session.username }, function(err, obj) {
      if (err) {
        return next(err)
      }
      if (obj === null) {
        q.save(function(err) {
          if (!err) {
            return res.send({ success: 'OK' })
          } else {
            next(err)
          }
        })
      } else {
        if (q.score > obj.score) {
          Score.updateOne({ user: req.session.username }, { score: req.body.score }, function(err, obj) {
            console.log(err)
          })
        }
      }
    })
  }
})

module.exports = router
