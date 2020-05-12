var express = require('express')
var User = require('../models/user.js')
var router = express.Router()
var isAuthenticated = require('../middlewares/isAuthenticated.js');

router.get('/signup', function(req, res) {
    res.render('signup', {
      layout: false,
    })
})

router.post('/signup', function(req, res, next) {
  const user = new User({
    username: req.body.username,
    password: req.body.password,
  })
  User.findOne({ username: req.body.username }, function(err,obj) {
    if (err) {
      return next(err)
    }
    if(obj === null){
      user.save(function(err) {
        if (!err) {
          res.redirect('/account/login')
        } else {
          next(err)
        }
      })
    } else {
      next(new Error('invalid credentials'));
    }
  });
})

router.get('/login', function(req, res) {
  res.render('login', {
    layout: false,
  })
})

router.post('/login', function(req, res, next) {
  User.findOne({ username: req.body.username }, function(err,obj) {
    if (err) {
      return next(err)
    }
    if(obj === null){
      next(new Error('invalid credentials'));
    } else {
      if(obj.password === req.body.password){
        req.session.username = req.body.username;
        res.redirect('/play');
      } else {
        next(err)
      }
    }
  });
})


router.get('/logout', isAuthenticated, function(req, res) {
  req.session.username = null;
  res.redirect('/');
})

module.exports = router
