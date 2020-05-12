var express = require('express')
var path = require('path')
var bodyParser = require('body-parser')
var cookieSession = require('cookie-session')
var mongoose = require('mongoose')
var hbs = require('express-handlebars')

var Score = require('./models/score.js')
var accountRouter = require('./routes/account.js')
var apiRouter = require('./routes/api.js')

// instantiate express app...
var app = express()
// instantiate a mongoose connect call
mongoose.connect(
  process.env.MONGODB_URI || 'mongodb://localhost:27017/hw5-new',
  { useNewUrlParser: true, useUnifiedTopology: true }
)

// set the express view engine to take care of handlebars within html files
app.engine('.hbs', hbs({ extname: '.hbs' }))
app.set('view engine', '.hbs')

app.use('/static', express.static(path.join(__dirname, 'static')))
app.use('/Game', express.static(path.join(__dirname, 'Game')))

app.use(bodyParser.urlencoded({ extended: false }))

app.use(
  cookieSession({
    name: 'local-session',
    keys: ['spooky'],
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  })
)

app.get('/', function(req, res, next) {
  Score.find({}, function(err, result) {
    if (err) {
      return next(err)
    }
    res.render('index', {
      scores: result,
      layout: false,
      user : req.session.username,
    })
  })
})

app.get('/play', function(req, res) {
  if(req.session.username) {
    res.render('play', {
      layout: false,
      user : req.session.username,
    })
  } else {
    res.redirect('/account/login');
  }
})

app.use('/account', accountRouter);
app.use('/api', apiRouter);

app.post('/play', function(req, res, next) {
  var score = req.body.score;
  var s = new Score({ score: score},{user: req.session.username})
  if(req.session.username) {
    s.save(function(err) {
      if (!err) {
        res.redirect('/')
      } else {
        next(err)
      }
    })
  }
})

// TODO: Set up account routes under the '/account' route prefix.
// (i.e. login should be /account/login, signup = /account/signup,
//       logout = /account/logout)

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Don't put any routes below here!
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

/**
 * Some browsers request the favicon (the little icon that shows up in the tab)
 * with every request, we just want to throw a 404 instead of any generic error
 */
app.get('/favicon.ico', function(_, res) {
  return res.status(404).send()
})

// Catch all for all other get requests
app.get('*', function(_, res) {
  return res.status(404).send()
})

// Middleware for catching any errors
app.use(function(err, _, res) {
  if (err) {
    return res.send('ERROR :  ' + err.message)
  }
})

/**
 * Now that the app is configured, start running the app. Print out to the
 * terminal/console where we can find the app.
 */
app.listen(process.env.PORT || 3000, function() {
  console.log('App listening on port ' + (process.env.PORT || 3000))
})
