var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongodb = require('mongodb');
var mongoose = require('mongoose');
var openurl = require('openurl');
var uri = 'mongodb://localhost/assignment7';
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
// mongoose.connect('mongodb://localhost/assignment7');
// var db1 = mongoose.connection;
// db1.on('error', console.error.bind(console, 'connection error:'));
// db1.once('open', function() {
//   console.log("we're connected!");
// });
// mongodb.MongoClient.connect(uri, function(error,db){
//   if(error){
//     console.log("error");
//   }
// });

app.get('/links', function(req, res) {
    mongodb.MongoClient.connect(uri, function(error, db) {
        if (error) {
            console.log(error);

        }
        db.collection('click_link').find().toArray(function(error, elements) {
            if (error) {
                console.log(error);

            }

            console.log("[");
            elements.forEach(function(value) {
                console.log("{");
                console.log("\"title\": \"" + value.title + "");
                console.log("\"link\": \"" + value.link + "");
                console.log("\"clicks\": " + value.clicks);
                console.log("}");

            });
            console.log("]");
        });
    });
});
// app.get('/links', function(req, res){
//
//   var link_data = db1.collection('click_link').find().toArray();
//   link_data.forEach(function(elements){
//    console.log(elements);
//   });
//   console.log(link_data+'hello world!');
//   if (link_data.length > 0) { printjson (link_data[0]); console.log(link_data); }
//   res.send(link_data);
// });
app.post('/links', function(req, res) {
    var title = req.body.title,
        link = req.body.link,
        value = {
            "title": title,
            "link": link,
            "clicks": 0
        };
    console.log(title);
    mongodb.MongoClient.connect(uri, function(error, db) {
        if (error) {
            console.log(error);
        }
        db.collection('click_link').insert(value, function(error) {
            if (error) {
                console.log(error);
            }
        });
    });
});
app.get('/click/:title', function(req, res) {
    var title = req.params.title;
    mongodb.MongoClient.connect(uri, function(error, db) {
        if (error) {
            console.log(error);

        }

            console.log(title);
            db.collection('click_link').findAndModify({
                "title": title
            }, [],{
                  $inc: {
                    "clicks": 1
                  }

            },{
              new: true
            });

           db.collection('click_link').find({
             'title' : title
           }).toArray(function(error, value){
             openurl.open(value.link);
           });
        });

});
app.listen(3000);
console.log('Running on port 3000....');
