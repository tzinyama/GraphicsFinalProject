
//Object that tracks the current state of the game

var game = {
  level:0,
  tokens:0,
  deaths:0,
  paused: false,
  update: function(){
    document.getElementById("tokens").innerHTML = ("Tokens: " + this.tokens);
    document.getElementById("deaths").innerHTML = ("Deaths: " + this.deaths);
  },
  pause:function(){
    this.paused = !this.paused;
    if(this.paused){
      document.getElementById("pause").innerHTML = ("PAUSED");
    }else{
      document.getElementById("pause").innerHTML = ("");
    }
  }
}
