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

const MONGODB_CONNECTION_STRING = process.env.DB;
mongoose.connect(MONGODB_CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true }, function(err, db) {
  if(err){console.log("error")}
});

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
        res.send(data);
      }
     })
    })
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]

    
    .post(function (req, res){
    if(!req.body.title){res.send("Please include a title")}
    else{
      var newBook=new Book({
        title: req.body.title,
        commentCount: 0
      })
    newBook.save();
    res.send(newBook);
    }
    })
    
    .delete(function(req, res){
      Book.deleteMany({}, function(err, data){ 
      if(err) res.send("could not delete");
       else res.send('complete delete successful');
    });
        });



  app.route('/api/books/:id')
    .get(function (req, res){
     var collection = Book.findById(req.params.id, function(err, data){ 
      if (!data){
        res.send( 'no book exists')
      return;}
      if(err) {res.send("no data found that matches params")
       return;}
      else  
        res.send(data);
     })
    })
  
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    
    .post(function(req, res){
      var bookid = req.params.id;
      var comment = req.query.comment;
      Book.findByIdAndUpdate(bookid, {new: true}, function(err, data){
      if(err){res.send('could not update '+bookid)}
        if(!data){res.send("Please enter a comment")}
      else{
        data.comments.push(comment);
        data.commentCount++
      data.save();
      res.send(data)
      }
      });
      //json res format same as .get
    })
    
    .delete(function(req, res){
      var bookid = req.params.id;
      if (!bookid){res.send('_id error')}
    else{Book.findByIdAndRemove(bookid, function(err, data){ 
      if(err) res.send("no book exists");
       else res.send('delete successful');
      //if successful response will be 'delete successful'
    });
        }
  });
  
};
