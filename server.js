var express = require('express');
var fs = require('fs');
var app = express();

var avatar_number;

fs.readdir("static/images/",function(err,files){
  avatar_number = files.length;
});

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static('static'));
app.engine('html',require('ejs').__express);

app.get('/',function(req,res){
  res.render('login.html',{'avatar_number':avatar_number});
})

app.post('/login',function(req,res){
  console.log(req.body);
  res.send();
});


var server = app.listen(9000, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://%s:%s', host, port);
});
