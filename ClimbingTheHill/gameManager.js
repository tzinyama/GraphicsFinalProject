
//Object that tracks the current state of the game

var game = {
  level:0,
  tokens:0,
  tokensSinceLevel:0,
  deaths:0,
  paused: false,
  levelSwitching:false,
  levelSwitchClock:0,
  levelYVel:0,
  cameraY:(HEIGHT/ 2) + 5,

  update: function(){
    document.getElementById("tokens").innerHTML = ("Tokens: " + this.tokens);
    document.getElementById("deaths").innerHTML = ("Deaths: " + this.deaths);
  },

  pause:function(){
    this.paused = !this.paused;
    document.getElementById("animate").checked = !this.paused;
    if(this.paused){
      document.getElementById("pause").innerHTML = ("PAUSED");
    }else{
      document.getElementById("pause").innerHTML = ("");
    }
  },

  nextLevel:function(){
    if(!this.levelSwitching){
      this.levelSwitchClock = 150;
      this.levelSwitching = true;
    }

    if(this.levelSwitchClock > 100){
      this.levelSwitchClock--;
      this.levelYVel = 0;
    }else if(this.levelSwitchClock > 50){
      this.levelSwitchClock--;
      this.levelYVel += .02
      camera.position.y += this.levelYVel;
    }else if(this.levelSwitchClock == 50){
      resetLevel(this.level + 1);
      this.levelSwitchClock--;
      camera.position.y = this.cameraY-24.5;
    }else if(this.levelSwitchClock > 0){
      this.levelSwitchClock--;
      camera.position.y += .5;
      // console.log(camera.position.y + " vs " + this.cameraY);
    } else{
      this.levelSwitching = false;
      this.levelYvel = 0;
      camera.position.y = this.cameraY;
    }
  }
}
