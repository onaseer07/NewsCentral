const mongoose = require("mongoose");

// Save a reference to the Schema constructor
const Schema = mongoose.Schema;

// Using the Schema constructor, create a new UserSchema object
// This is similar to a Sequelize model
const ArticleSchema = new Schema({
  // `title` is required and of type String
  title: {
    type: String,
    required: true,
    unique: true
  },
  // `link` is required and of type String
  link: {
    type: String,
    required: true,
    unique: true
  },
  paragraph: {
    type:String,
    required: true,
    unique: true
  },
  saved: {
    type: Boolean,
    default: false,
    required: true
  },
  note:[{
    type: Schema.Types.ObjectId,
    ref: "Note"
  }]
});

// This creates our model from the above schema, using mongoose's model method
const Article = mongoose.model("Article", ArticleSchema);

// Export the Article model
module.exports = Article;
