let app = require("http").createServer()
let io = module.exports.io = require("socket.io")(app)
const PORT = process.env.PORT || 1234
io.on("connection", function(socket){
    console.log("Connected: " + socket.id)
    socket.on("msg", function(data){
        io.emit("msg", data)
    })
})
app.listen(PORT, function(){
    console.log("Back-end running on port: " + PORT)
})