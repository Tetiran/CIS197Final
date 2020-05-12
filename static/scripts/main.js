/* global $ */
$(document).ready(function() {
  var data = []
  var activeIdx = -1

  // kick off getting the questions
  getScores()
  // now do it  every 2.5 seconds
  setInterval(getScores, 2500)

  function getScores() {
    $.ajax({
      url: '/api/score',
      data: {},
      type: 'GET',
      success: function(res) {
        data=res;
        renderScores();
      },
    })

  }
  // render scores into the DOM
  function renderScores() {
    $('#scores').html(('<tr>'+
      '<th>User</th>'+
      '<th>High Score</th>'+
      '</tr>').concat(
      data.map(i => '<tr data-qid="' + i._id + '">' +  '<th>' + i.user  +'</th>'  + '<th>' + i.score +'</th>'+ '</tr>')
        .join(''))
    )
  }
})
