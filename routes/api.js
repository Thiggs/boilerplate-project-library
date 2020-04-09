/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

var Schema = mongoose.Schema;

var bookSchema = new Schema({
  title: { type: String, required: true },
  comments: [String],
  commentCount: Number
});

var Book = mongoose.model("Book", bookSchema);

module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res){
    var query = req.query
     var collection = Book.find(query, function(err, data){ 
      if (!data){res.send( 'no book exists')}
      if(err) res.send("no data found that matches params");
      else  {
        data.commentCount = data.comments
        res.send(data);
      }
     })
    })
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]

    
    .post(function (req, res){
    if(!req.body.title){res.send("Please include a title")}
    else{
      var title = req.body.title;
      var newBook=new Book({
        title: title
      })
    newBook.save;
    res.send(newBook);
    }
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      var bookid = req.params.id;
     var collection = Book.findById(bookid, function(err, data){ 
      if (!data){
        res.send( 'no book exists')}
      if(err) res.send("no data found that matches params");
      else  res.send(data);
     })
    })
  //
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    
    .post(function(req, res){
      var bookid = req.params.id;
      var comment = req.body.comment;
      Book.findByIdAndUpdate(bookid, {new: true}, function(err, data){
      if(err){res.send('could not update '+bookid)}
        if(!comment){res.send("Please enter a comment")}
      else{
        data.comment.push(comment);
      data.save();
      res.send(data)
      }
      });
      //json res format same as .get
    })
    
    .delete(function(req, res){
      var bookid = req.params.id;
      //if successful response will be 'delete successful'
    });
  
};
