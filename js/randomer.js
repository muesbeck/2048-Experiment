function Randomer() {
}

Randomer.prototype.getBest = function() {
    function rndmK() {
        var i = Math.random()
        if (i <= 0.25){
               return 0;
        } else {
            if (i <= 0.5) {
               return 1;
            } else {
                if (i <=0.75) {
                  return 2;
                 } else {
                  return 3;
                 }
            }
        } 
    }
    var best = rndmK();
    return { move: best };
}
