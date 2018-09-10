
$.backstretch('bg.png');
// Grab the articles as a json


$(document).on('click','#scrapeBtn',function(){
  $.ajax({
    method: 'GET',
    url: '/scrape'
  })
    .then(function(data){
      console.log(data);

    });
});

$(document).on('click','#pasteBtn',function(){
  window.location.href='/articles';
})
//   $.ajax({
//     method: 'GET',
//     url: '/articles'
//   })
//     .then(function(data){
//       console.log(data);
//       // $.getJSON("/articles", function(data) {
//       //   // For each one
//       //   for (var i = 0; i < data.length; i++) {
//       //     // Display the apropos information on the page
//       //     $("#articles").append(
//       //       `<p><h3 class="text-center">${data[i].title}</h3><br><h5 class="p-3"><small>${data[i].paragraph}</small></h5><br>
//       //       <button data-toggle="modal" data-target="#exampleModal" data-id='${data[i]._id}' class="addNote">Add a Note</button><br>
//       //       <a class="text-center" href="${data[i].link}">More>></a></p><hr>`);
//       //   }
//       // });
//     });
// });

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
      console.log(data);
      if(data.note){
        let noteTitles = data.note;
        noteTitles.forEach(element =>{
          $('#savedNotes').append(`
          <h6 class="text-center">${element.title} <small id="'${element._id}" class="deleteNote">X</small></h6>
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
        // Place the title of the note in the title input
        // $("#titleinput").val(data.note.title);
        // // Place the body of the note in the body textarea
        // $("#bodyinput").val(data.note.body);
      }
    });
});

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
