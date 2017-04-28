window.onload = function(){
  var form = document.getElementsByClassName('send-words')[0];
  var sm = document.getElementsByClassName('submit')[0]

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

  setInterval(function(){
    var poll = new XMLHttpRequest();
    poll.open('get','/update');
    poll.onreadystatechange = function(){
      if (poll.status === 200 && poll.readyState === 4){
        console.log(poll.responseText);
        if (poll.responseText !== 'null'){
          showWords(JSON.parse(poll.responseText));
        }
      }
    }
    poll.send();
  },500);

}

window.onbeforeunload = function(){
  var logout = new XMLHttpRequest();
  logout.open('get','/logout');
  logout.send();
}

function showWords(data){
  var wordlist = document.getElementsByClassName('wordlist')[0];
  var l = data.length;
  for (var i=0; i<l; i++){
    var words = new Words(data[i]);
    wordlist.insertBefore(words,wordlist.firstChild);
  }
}

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
