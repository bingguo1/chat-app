const express = require("express");
const socket = require("socket.io");

// App setup

const app = express();
const http = require('http');
const server = http.createServer(app);
const io = socket(server);


const activeUsers = new Set();


app.use(express.static(__dirname + '/public'));
///// once you set public folder and put index.html there, you don't have to set a router for index.html any more

// app.get('/', (req, res) => {
//     res.sendFile(__dirname+'/public/index.html');
// });


io.on("connection", function (socket) {
    console.log("Made socket connection");
    
    socket.on("new user", function (data) {
    socket.userId = data;
    activeUsers.add(data);
    io.emit("new user", [...activeUsers]);
  });

  socket.on("disconnect", () => {
    activeUsers.delete(socket.userId);
    io.emit("user disconnected", socket.userId);
  });

    socket.on("chat message", function (data) {
	io.emit("chat message", data);
    });

    socket.on("typing", function (data) {
    socket.broadcast.emit("typing", data);
  });
    
});


server.listen(3000, () => {
    console.log('listening on *:3000');
});
