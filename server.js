var express = require('express');
var fs = require('fs');
var app = express();
var cookieParser = require('cookie-parser');
var session = require('express-session');
var id = 0;
var users = [];
var wordlist = [];

// 信息对象构造函数
// user_id: 用户id
//       w: 信息字符串
function Words(user_id,w){
  this.user_id = user_id;
  this.w = w;
}

// 用户对象构造函数
// username： 用户名
//   avatar： 头像名字
//     last： 获得的最后一条信息（用来判断是否需要发送信息到该用户）
function User(username,avatar,last){
  this.username = username;
  this.avatar = avatar;
  this.id = id++;
  this.last = last;
}

// 通过用户id来寻找用户对象
function getUser(id,users){
  for (var i=0,l=users.length; i<l; i++){
    if (users[i].id === id){
      return users[i];
    }
  }
}

// 删除用户，当用户退出时候会调用
function removeUser(id,users){
  for (var i=0,l=users.length; i<l; i++){
    if (users[i].id === id){
      users.splice(i,1);
      break;
    }
  }
}

// 通过用户id补全wl的信息
function getUserMsg(wl,users){
  var ret = []
  for (var i=0, l=wl.length; i<l; i++){
    var user = getUser(wl[i].user_id,users);
    ret.push({'username':user.username,'avatar':user.avatar,'words':wl[i].w});
  }
  return ret;
}

var avatar_number;

// 保存头像数目
fs.readdir("static/images/",function(err,files){
  avatar_number = files.length;
});

// 使用解析JSON的工具，还有session的工具
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser())
app.use(session({
  secret: '123',
  resave: true,
  }
))

// 静态文件路径
app.use(express.static('static'));
app.engine('html',require('ejs').__express);

// 第一个页面，用来登陆
app.get('/',function(req,res){
  res.render('login.html',{'avatar_number':avatar_number});
})

// 登陆需要保存用户信息，然后跳转到home主页
app.post('/login',function(req,res){
  var user_id = req.cookies.user_id;
  var user;
  if (user_id){
    var l = users.length;
    for (var i = 0; i < l ;i ++){
      if (users[i] === user_id){
        user = users[i];
        break;
      }
    }
  }
  else{
    user = new User(req.body.username,req.body.avatar,wordlist.length);
    users.push(user);
    req.session.user_id = user.id;
  }

  res.render('home.html',user);
});


// 获取用户发来的信息
app.post('/send',function(req,res){
  var words = new Words(req.session.user_id,req.body.words);
  wordlist.push(words);
  res.send(200);
});

// 回应用户的轮询
app.get('/update',function(req,res){
  var user = getUser(req.session.user_id,users);
  var last = user.last;
  if (last < wordlist.length){
    user.last = wordlist.length;
    var data = getUserMsg(wordlist.slice(last),users);
    res.json(data);
  }
  else {
    res.json(null);
  }
});

// 退出
app.get('/logout',function(req,res){
  removeUser(req.session.user_id,users);
  delete req.session.user_id;
  res.send(200);
});


// 开始监听
var server = app.listen(8004, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://%s:%s', host, port);
});
