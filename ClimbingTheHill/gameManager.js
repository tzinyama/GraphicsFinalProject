
//Object that tracks the current state of the game

var game = {
  level:0,
  tokens:0,
  tokensSinceLevel:0,
  deaths:0,
  paused: false,
  started: false,
  levelSwitching:false,
  levelSwitchClock:0,
  targetLevel:0,
  levelYVel:0,
  cameraY:(HEIGHT/ 2) + 5,

  update: function(){
    document.getElementById("tokens").innerHTML = ("Tokens: " + this.tokens + "     Deaths: " + this.deaths);
  },

  pause:function(){
    this.paused = !this.paused;
    if(this.paused){
      document.getElementById("pause").innerHTML = ("PAUSED");
    }else{
      document.getElementById("pause").innerHTML = ("");
    }
  },

  goToLevel:function(n){
    toggleDebugMode();
    toggleDebugMode();
    if(!this.levelSwitching){
      this.levelSwitchClock = 150;
      this.levelSwitching = true;
      this.levelYVel = 0;
      this.targetLevel = n;
    }
    if(this.levelSwitchClock > 100){
        this.levelSwitchClock--;
    }else if(this.levelSwitchClock > 50){
      this.levelSwitchClock--;
      this.levelYVel += .02
      camera.position.y += this.levelYVel;
    }else if(this.levelSwitchClock == 50){
      resetLevel(this.targetLevel);
      this.levelSwitchClock--;
      camera.position.y = this.cameraY-24.5;
    }else if(this.levelSwitchClock > 0){
      this.levelSwitchClock--;
      camera.position.y += .5;
    } else{
      this.levelSwitching = false;
      this.levelYvel = 0;
      camera.position.y = this.cameraY;
      if(this.level>=8){
        showEndScreenText(true);
      }else{
        showEndScreenText(false);
      }
    }
  }
}
