function WebSocketManager() {
  this.ws = new WebSocket("ws://localhost:9090");
  this.ws.onopen = function() { 
    console.log("worked");
  };
}


WebSocketManager.prototype.send = function (message) {
    this.ws.send(message);
}
