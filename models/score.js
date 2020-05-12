var mongoose = require('mongoose')

var scoreSchema = new mongoose.Schema({
  user: { type: String },
  score: { type: Number },
})

module.exports = mongoose.model('Score', scoreSchema)
