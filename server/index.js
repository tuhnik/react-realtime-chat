let app = require("http").createServer();
let io = (module.exports.io = require("socket.io")(app));
const PORT = process.env.PORT || 1234;
let users = [{username: "Valvur", gender: "female"}];
io.on("connection", function(socket) {
  socket.on("msg", function(data) {
    io.emit("msg", data);
  });
  socket.on("connected", function(username) {});

  socket.on("login", function(data) {
    if (users.filter(user=>user.username.toLowerCase() === data.username.toLowerCase()).length) {
      socket.emit("loginerror", "Username already taken!");
      return;
    }
    if (data.username.length > 20) {
      socket.emit("loginerror", "Username too long!");
      return;
    }
    if (data.username.length < 2) {
      socket.emit("loginerror", "Username too short!");
      return;
    }
    if (data.username.toLowerCase() === "server") {
      socket.emit("loginerror", "This username is reserved!");
      return;
    }

    socket.emit("login", data.username);
    users.push({username: data.username, gender: data.gender});
    socket.username = data.username;
    socket.gender = data.gender;
    io.emit("userlist", users);
    io.emit("msg", { username: "Server", msg: data.username + " joined", gender: data.gender });
  });

  socket.on("disconnect", function() {
    if (!socket.username) {
      return;
    }
    users = users.filter(el => el.username !== socket.username)
    
    io.emit("userlist", users);
    io.emit("msg", { username: "Server", msg: socket.username + " left", gender: socket.gender });

  });
});
app.listen(PORT, function() {
  console.log("Back-end running on port: " + PORT);
});
