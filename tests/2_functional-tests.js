/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentCount', 'Books in array should contain commentCount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {


    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
             chai.request(server)
        .post('/api/books')
        .send({
          title: 'Title',
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.include(res.body, {
          title: 'Title'
        })        
          done();
                }) 
        });
      
      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
        .post('/api/books')
        .send({
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, "Please include a title")        
          done();
                }) 
        });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
      chai.request(server)
      .get('/api/books')   
       .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        done();
      });
    });
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
      chai.request(server)
      .get('/api/books/1234')   
       .end(function(err, res){
        assert.equal(res.status, 200);
        assert.equal(res.text,  'no book exists');
        done();
      });
    });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
      chai.request(server)
      .get('/api/books/5e91ffbb88f20f123a627ab8')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.property(res.body, 'commentCount');
        assert.property(res.body, 'title');
        assert.property(res.body, '_id');
        done();
      });
  });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
      chai.request(server)
      .post('/api/books/5e920c9ad6b4bf2c175ff7ab')
      .query({
        comment: "Hello World!"
      })
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.property(res.body, 'commentCount', 'Books in array should contain commentCount');
        assert.property(res.body, 'title');
        assert.property(res.body, '_id');
        done();
      
    });

  });

})
  })
});