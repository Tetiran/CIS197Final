var express = require('express')
var router = express.Router()
var Question = require('../models/question.js')

router.get('/questions', function(_, res, next) {
  Question.find({}, function(err, result) {
    if (err) {
      next(err)
    } else {
      return res.send(result);
    }
  })
})

router.post('/questions/add', function(req, res, next) {
  var q = new Question({ questionText: req.body.questionText, author: req.session.username})
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

router.post('/questions/answer', function(req, res, next) {
  var questionId = req.body.questionId;
  var answer = req.body.answer
  if(req.session.username) {
    Question.update({ _id: questionId },{$set: { answer: answer }}, function(err) {
      if (!err) {
        return res.send({ success: 'OK' });
      } else {
        next(err);
      }
    });
  }
})

module.exports = router
