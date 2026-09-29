if(!getSession()){
  window.location.href = 'login.html';
} else {
  setTimeout(()=>{ window.location.href = 'home.html'; }, 2200);
}
