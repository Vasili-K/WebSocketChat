const express = require("express");
const app = express();

app.set("nodemon", "./views");
app.set("view engine", "ejs");

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index");
});

server = app.listen("3000", () => console.log("Server is runing..."));

const io = require("socket.io")(server);

//let users = [];
let connections = [];

io.sockets.on("connection", (socket) => {
  console.log("New user connected");
  connections.push(socket);

  socket.on("disconnect", (data) => {
    connections.splice(connections.indexOf(socket), 1);
    console.log("User disconnected");
  });

  socket.on("send_message", (data) => {
    io.sockets.emit("add_message", {
      mess: data.mess,
      usName: data.usName,
      color: data.color,
    });
    socket.broadcast.emit("send_message");
  });

  socket.on("typing", (data) => {
    socket.broadcast.emit("typing", { usName: data.usName });
  });
});
