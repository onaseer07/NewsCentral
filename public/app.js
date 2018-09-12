
$.backstretch('bg.png');
// Grab the articles as a json
$(document).on('click','#scrapeBtn',function(){
  $.ajax({
    method: 'GET',
    url: '/scrape'
  })
    .then(function(data){
      console.log(data);
      window.location.href='/articles';
    });
});

$(document).on('click','#savedArt',function(){
  $.ajax({
    method: 'GET',
    url: '/savedarticles'
  })
    .then(function(data){
      console.log(data);
      window.location.href='/savedarticles'
    });
});
$(document).on('click','#Art',function(){
  $.ajax({
    method: 'GET',
    url: '/articles'
  })
    .then(function(data){
      console.log(data);
      window.location.href='/articles'
    });
});
// //on click my saved articles button direct user to /savedarticles
// $(document).on('click','#savedArt',function(){
//   window.location.href='/savedarticles';
// })
// Whenever someone clicks a add a note button
$(document).on("click", ".addNote", function() {
  // // Empty the notes from the note section
  $("#notes").empty();
  $("#savedNotes").empty();
  $('.modal-footer').empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .then(data => {
      if(data.note){
        $('#savedNotes').empty();
        let noteTitles = data.note;
        noteTitles.forEach(element =>{
          console.log(noteTitles);
          $('#savedNotes').append(`
          <h6 class="text-center">${element.title} <small data-id="${element._id}" class="deleteNote">X</small></h6>
          `)
        });
      }

      // The title of the article
      $("#notes").append("<h2>" + data.title + "</h2>");
      // An input to enter a new title
      $("#notes").append("<input id='titleinput' name='title' placeholder='Title'>");
      // A textarea to add a new note body
      $("#notes").append("<textarea id='bodyinput' name='body' placeholder='Note'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $(".modal-footer").append("<button class='btn btn-primary' data-id='" + data._id + "' id='savenote'>Save Note</button>");

      // If there's a note in the article
      if (data.note) {
        let notesArray = data.note;
        notesArray.forEach(element => {
          console.log(element.title);
        });
      }
    });
});
//When someone deletes a specific note it sends "DELETE" request to server at route deletenote/:id
$(document).on('click','.deleteNote',function(){

  var thisId = $(this).attr('data-id');
  $(this).parent().text('');
  $.ajax({
    method: 'POST',
    url: '/deletenote/' + thisId,
  }).then(function(data){
    console.log(data);
  })
})
// When you click the savenote button
$(document).on("click", "#savenote", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .then(function(data) {
      // Log the response
      console.log(data);
      // // Empty the notes section
      $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});

//when user saves an article it sets the saved attribute of this specific article to true and page reloads
$(document).on('click','.saveArt',function(){
  var thisId = $(this).attr('data-id');
  console.log(thisId);
  $.ajax({
    method: 'POST',
    url: '/savedarticles/'+ thisId
  }).then(function(data){
    console.log(data);
    window.location.reload();
  });
});
$(document).on('click','.saveArtDel',function(){
  var thisId = $(this).attr('data-id');
  console.log(thisId);
  $.ajax({
    method: 'POST',
    url: '/unsavedarticles/'+ thisId
  }).then(function(data){
    console.log(data);
    window.location.reload();
  });
});
