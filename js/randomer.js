function Randomer() {
}

Randomer.prototype.getBest = function() {
    function rndmK() {
        var i = Math.random()
        if (i <= 0.25){
               return 37;
        } else {
            if (i <= 0.5) {
               return 38;
            } else {
                if (i <=0.75) {
                  return 39;
                 } else {
                  return 40;
                 }
            }
        } 
    }
    var best = rndmK();
    return { move: best };
}
