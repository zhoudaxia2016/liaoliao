window.onload = function(){
  var submit = document.getElementsByClassName('submit')[0];
  submit.onclick = function(){
    var form = document.getElementsByClassName('login')[0];
    if (!form.username.value){
      alert('请报上名号！');
      return false;
    }
    else if (!form.avatar.value){
      alert(form.username.value+'请选一张萌萌哒的头像！');
      return false;
    }
    else{
      return true;
    }
  }
}
