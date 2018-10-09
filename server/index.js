let app = require("http").createServer()
let io = module.exports.io = require("socket.io")(app)
const PORT = process.env.PORT || 1234
let users = []
io.on("connection", function(socket){
    socket.on("msg", function(data){
        io.emit("msg", data)
    })
    socket.on("connected", function(username){
        users.push(username)
        socket.username = username
        io.emit("userlist", users)
        io.emit("msg", {username: "Server", msg: username + " joined"})
    })
    socket.on('disconnect', function(){
        users.splice(users.indexOf(socket.username), 1);
        io.emit("userlist", users)
        io.emit("msg", {username: "Server", msg: socket.username + " left"})
      });
})
app.listen(PORT, function(){
    console.log("Back-end running on port: " + PORT)
})