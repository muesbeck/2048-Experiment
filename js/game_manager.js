function GameManager(size, InputManager, Actuator) {
  this.size         = size; // Size of the grid
  this.inputManager = new InputManager;
  this.actuator     = new Actuator;
  this.logsender    = new LogSender;
  this.runs         = 0;
  this.isRandomRound = 0;
  this.randomer     = new Randomer();
  this.startTime    = (new Date()).getTime();


  this.running      = false;

  this.inputManager.on("move", this.move.bind(this));
  this.inputManager.on("restart", this.restart.bind(this));

  this.inputManager.on('think', function() {
    var best = this.ai.getBest();
    this.actuator.showHint(best.move);
  }.bind(this));


  this.inputManager.on('run', function() {
    this.runNow();
  }.bind(this));

  this.setup();
}

GameManager.prototype.runNow = function () {
     if (this.running) {
      this.running = false;
      this.actuator.setRunButton('Auto-run');
    } else {
      this.running = true;
      this.run();
      this.actuator.setRunButton('Stop');
    }
}

GameManager.prototype.genGuid = function () {
    var id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
    return v.toString(16);
    });
    return id;
}

// Restart the game
GameManager.prototype.restart = function () {
  this.actuator.restart();
  this.running = false;
  this.actuator.setRunButton('Auto-run');
  this.setup();
};

// Set up the game
GameManager.prototype.setup = function () {
  this.grid         = new Grid(this.size);
  this.grid.addStartTiles();

  this.ai           = new AI(this.grid);
 
  this.score        = 0;
  this.turns        = 0;
  this.guid         = this.genGuid();
  this.over         = false;
  this.won          = false;

  // Update the actuator
  this.actuate();
};


// Sends the updated grid to the actuator
GameManager.prototype.actuate = function () {
    if (this.runs < timesToRunExperiment + 1 && (this.over || this.won) ) {
        if (this.isRandomRound == 0) {
            this.logsender.send("Date: " + new Date() + " ;Type: AI ;Guid: " + this.guid +  " ;Run: " + this.runs + " ;Score: " + this.score + " ;Turns: " + this.turns + " ;WonStatus: " + this.won + " ;TimeTaken: " + ((new Date()).getTime() - this.startTime));
        } else {
            this.logsender.send("Date: " + new Date() + " ;Type: RND ;Guid: " + this.guid +  " ;Run: " + this.runs + " ;Score: " + this.score + " ;Turns: " + this.turns + " ;WonStatus: " + this.won + " ;TimeTaken: " + ((new Date()).getTime() - this.startTime));
        }
        this.runs += 1;
        if ( this.runs < timesToRunExperiment) {
            if (this.runs % 2 == 0) {
                this.isRandomRound = 0;
            } else {
                this.isRandomRound = 1;
            }
            this.restart();
            this.startTime = (new Date()).getTime();
            this.runNow();
        }
      } else {

      this.actuator.actuate(this.grid, {
        score: this.score,
        over:  this.over,
        won:   this.won
      }); 
  }
};

// makes a given move and updates state
GameManager.prototype.move = function(direction) {
  var result = this.grid.move(direction);
  this.score += result.score;
  this.turns += 1;

  if (!result.won) {
    if (result.moved) {
      this.grid.computerMove();
    }
  } else {
    this.won = true;
  }

  //console.log(this.grid.valueSum());

  if (!this.grid.movesAvailable()) {
    this.over = true; // Game over!
  }

  this.actuate();
}

// moves continuously until game is over
GameManager.prototype.run = function() {
      if (this.isRandomRound < 1) {
        var best = this.ai.getBest();
      } else { 
        var best = this.randomer.getBest();
      }
      this.move(best.move);
      var timeout = animationDelay;
      if (this.running && !this.over && !this.won) {
        var self = this;
        setTimeout(function(){
          self.run();
        }, timeout);
      }
     
}
