function LogSender() {
}


LogSender.prototype.send = function (message) {
    $.ajax({
    type: "POST",
    url: "http://127.0.0.1:9090",
    data: message,
    });
}
