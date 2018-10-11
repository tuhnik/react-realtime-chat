let app = require("http").createServer();
let io = (module.exports.io = require("socket.io")(app));
const PORT = process.env.PORT || 1234;
let users = [];
io.on("connection", function(socket) {
  socket.on("msg", function(data) {
    io.emit("msg", data);
  });
  socket.on("connected", function(username) {});

  socket.on("login", function(username) {
    if (users.indexOf(username) > -1) {
      socket.emit("loginerror", "Username already taken!");
      return;
    }
    if (username.length > 20) {
      socket.emit("loginerror", "Username too long!");
      return;
    }
    if (username.length < 2) {
      socket.emit("loginerror", "Username too short!");
      return;
    }
    if (username.toLowerCase() === "server") {
      socket.emit("loginerror", "This username is reserved!");
      return;
    }

    socket.emit("login", username);
    users.push(username);
    socket.username = username;
    io.emit("userlist", users);
    io.emit("msg", { username: "Server", msg: username + " joined" });
  });

  socket.on("disconnect", function() {
    if (!socket.username) {
      return;
    }
    users.splice(users.indexOf(socket.username), 1);
    io.emit("userlist", users);
    io.emit("msg", { username: "Server", msg: socket.username + " left" });
  });
});
app.listen(PORT, function() {
  console.log("Back-end running on port: " + PORT);
});
