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
    // TODO: make an ajax request to /api/getQuestions. on success
    //       set  the data variable equal to the response and render
    //       out the question previews (by callingrenderPreviews())
    //       Later on in the writeup, also render the active question
    //       (to update it) with renderactive()
  }

  /**
   * Makes a list  of questions which all have the question text and a data-qid attribute
   * that allows you to access their _id by doing $whateverjQueryObjectYouHave.data('qid')
   */
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
