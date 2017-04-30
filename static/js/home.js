window.onload = function(){
  var form = document.getElementsByClassName('send-words')[0];
  var sm = document.getElementsByClassName('submit')[0]

  // 发送信息
  sm.onclick = function(e){
    var data = 'words=' + form.words.value;
    var xhr = new XMLHttpRequest();
    xhr.open('post','/send');
    xhr.setRequestHeader("CONTENT-TYPE","application/x-www-form-urlencoded");
    xhr.onreadystatechange = function(){
      if (xhr.status === 200 && xhr.readyState == 4){
        console.log('sucess!');
      }
    }
    xhr.send(data);
    document.getElementById('words').value = '';
    return false;
  };

  var lo = document.getElementsByClassName('logout')[0];
  lo.onclick = function(){
    clearInterval(timer);
    var logout = new XMLHttpRequest();
    logout.open('get','/logout');
    logout.onreadystatechange = function(){
      if (logout.readyState === 4 && logout.status === 200){
        window.history.back();
      }
    }
    logout.send();
  };

  document.getElementsByClassName('send-words')[0].onclick = function(){
    document.getElementsByClassName('users')[0].style.display = 'none';
  }
  document.getElementsByClassName('wordlist')[0].onclick = function(){
    document.getElementsByClassName('users')[0].style.display = 'none';
  }
  document.body.addEventListener('click',function(){
    document.getElementsByClassName('users')[0].style.display = 'none';
  },true);

  document.getElementsByClassName('show-users')[0].onclick = function(){
    document.getElementsByClassName('users')[0].style.display = 'block';
  }


  // 轮询
  var timer = setInterval(function(){
    // 更新信息
    var poll = new XMLHttpRequest();
    poll.open('get','/update');
    poll.onreadystatechange = function(){
      if (poll.status === 200 && poll.readyState === 4){
        if (poll.responseText !== 'null'){
          showWords(JSON.parse(poll.responseText));
        }
      }
    }
    poll.send();

    // 更新已登陆用户
    var poll2 = new XMLHttpRequest();
    poll2.open('get','/allusers');
    poll2.onreadystatechange = function(){
      if (poll2.status === 200 && poll2.readyState === 4){
        if (poll2.responseText != 'null'){
          var data = JSON.parse(poll2.responseText);
          showUsers(data);
        }
      }
    }
    poll2.send();

  },500);

}

// 退出
window.onbeforeunload = function(){
  var logout = new XMLHttpRequest();
  logout.open('get','/logout');
  logout.send();
}

// 添加信息
function showWords(data){
  var wordlist = document.getElementsByClassName('wordlist')[0];
  var l = data.length;
  for (var i=0; i<l; i++){
    var words = new Words(data[i]);
    wordlist.insertBefore(words,wordlist.firstChild);
  }
}

// 创建一条信息
function Words(data){
  var item = document.createElement('div');
  item.className = 'item';

  var img = document.createElement('img');
  img.setAttribute('src','/images/'+data.avatar+'.png');
  img.className = 'avatar';
  item.appendChild(img);

  var un_words = document.createElement('div');
  un_words.className = 'un-words';

  var un = document.createElement('div');
  un.innerText = data.username;
  un.className = 'un';
  un_words.appendChild(un);

  var words = document.createElement('p');
  words.className = 'words';
  words.innerText = data.words;
  un_words.appendChild(words);

  item.appendChild(un_words);

  return item;
}

// 修改用户列表
function showUsers(data){
  var users = document.getElementsByClassName('users')[0];
  users.innerHTML = '';
  var l = data.length;
  var num = document.getElementById('num');
  num.innerText = l;
  for (var i=0; i<l; i++){
    var user = new User(data[i]);
    users.insertBefore(user,users.firstChild);
  }
}

// 新建一个用户
function User(data){
  var user = document.createElement('div');
  user.className = 'user-item';

  var img = document.createElement('img');
  img.src = '/images/'+data.avatar+'.png';
  img.className = 'avatar';
  user.appendChild(img);

  var un = document.createElement('div');
  un.className = 'un';
  un.innerText = data.username;
  user.appendChild(un);

  return user;
}
