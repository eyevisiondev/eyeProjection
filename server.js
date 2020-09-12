var app = require("express")();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

const cors = require("cors");
app.use(cors());

var http = require("http").createServer(app);
var io = require("socket.io")(http);

app.get("/", function(req, res) {
  res.send("Node OK!!!");
});

app.get("/send", function(req, res) {
  let movie = req.query.movie;
  let token = req.query.token;
  io.sockets.emit("message", { movie: movie, token: token });
  res.send("true");
});

io.on("connection", function(client) {
  client.on("join", function(name) {
    console.log("Joined: " + name);
  });

  client.on("send", function(msg) {
    console.log("Message: " + msg);
    io.emit("message", "this is a test");
  });

  client.on("disconnect", function() {
    console.log("Disconnect");
  });
});

http.listen(8000, "0.0.0.0", function() {
  console.log("listening on *:8000");
});
