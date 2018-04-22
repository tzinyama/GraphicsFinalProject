
//Object that tracks the current state of the game

var game = {
  level:0,
  tokens:0,
  deaths:0,
  update: function(){
    document.getElementById("tokens").innerHTML = ("Tokens: " + this.tokens);
    document.getElementById("deaths").innerHTML = ("Deaths: " + this.deaths);
  }
}
