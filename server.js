var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
var axios= require('axios');
// It works on the client and on the server
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = process.env.PORT || 3000;

// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
// Connect to the Mongo DB
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/Articles";
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

// Routes
app.get('/',(req,res)=>{
  db.Article.find({})
  .then(function(data){ 
    if(data) {
      let dbData = {article:data};
      res.render('index', dbData);
    } else {
      res.render('index');
    }
  })
  .catch(function(err) {
    res.json(err)
});
}) 
// A GET route for scraping the echoJS website
app.get("/scrape", function(req, res) {
  // First, we grab the body of the html with request
  axios.get('https://www.wsj.com/')
  .then(function(response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);

    $('h3.wsj-headline').each(function(err, element){
    
      var title = $(element).text();
      var paragraph = $(element).parent().find($('p.wsj-summary')).text();
      // var paragraph = $(element).find('div[class=wsj-card-body]').children('p').text();
      var link = $(element).children('a').attr('href');
  
      var scrappedObj = {
        link:link,
        title:title,
        paragraph:paragraph
      };
      // console.log('This is about to be stored in MongoDB:',scrappedObj);
      db.Article.create(scrappedObj)
      .then(function(data){
        // console.log(data);
      })
      .catch(function(err){
        return res.json(err);
      })
    });
    // If we were able to successfully scrape and save an Article, send a message to the client
    res.send('Scrape Completed!');
  });
});

// Route for getting all Articles from the db
app.get("/articles", function(req, res) {
  db.Article.find({})
  .then(function(data){
    let dbData = {article:data};
    res.render('index', dbData);
  })
  .catch(function(err) {
    res.json(err)
});
});

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function(req, res) {
  // TODO
  // ====
  // Finish the route so it finds one article using the req.params.id,
  db.Article.findById(req.params.id)
  .populate('note')
  .then(function(data){
    res.json(data);
  })
  .catch(function(err){
    res.json(err);
  })
  // and run the populate method with "note",
  // then responds with the article with the note included
});

// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function(req, res) {
  // TODO
  // ====
  // save the new note that gets posted to the Notes collection
  db.Note.create(req.body)
  .then(function(data){
    return db.Article.findOneAndUpdate({_id:req.params.id},{$push:{note:data.id}},{new:true});
  })
  .then(function(dbArticle){
    res.json(dbArticle);
  })
  .catch(function(err){
    res.json(err);
  })
  // then find an article from the req.params.id
  // and update it's "note" property with the _id of the new note
});

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});