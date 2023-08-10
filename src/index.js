const path = require("path");
const http = require("http");
const cors = require("cors")
const express = require("express");
const bodyParser = require('body-parser');
const socketio = require("socket.io");
const Filter = require("bad-words");
const { generateMessage, generateLocationMessage } = require("./utils/messages");
const { addUser, removeUser, getUser, getUsersInRoom } = require("./utils/users");
// const webPush = require('web-push');
const database = require('./config/database');
const webpush = require('./config/webpush');

const initializeRoutes = require('./routes');


// const publicVapidKey = 'BMaIRPtK4Ayt4y_6kU3ebzWl2tJKPnJOM4XWcA0virHyOhWmP8-EwjIWhcr1tUzpc5N0R_G7LREsDq3evVcByZg';
// const privateVapidKey = 'rvd4pHMw3meamEwYl012tuSZ8y2FYXFpNeazJYX7-3o';

// webPush.setVapidDetails('mailto:test@example.com', publicVapidKey, privateVapidKey);

const app = express();
const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, "../public");

app.use(express.static(publicDirectoryPath));
app.use(bodyParser.json());
app.use(cors());
const server = http.createServer(app);
const io = socketio(server);

database();
initializeRoutes(app);
webpush();

require("dotenv").config();

io.on("connection", socket => {
  console.log("New WebSocket connection");

  socket.on("join", (options, callback) => {
    const { error, user } = addUser({ id: socket.id, ...options });
    if (error) {
      return callback(error);
    } else {
      socket.join(user.room);

      // socket.emit("message", generateMessage("Admin", "Welcome!"));
      socket.broadcast.to(user.room).emit("message", generateMessage("Admin", `${user.username} has joined!`));
      io.to(user.room).emit("roomData", {
        room: user.room,
        users: getUsersInRoom(user.room)
      });

      callback();
    }
  });

  socket.on('typing', (data)=>{
    if(data.typing==true)
       io.emit('display', data)
    else
       io.emit('display', data)
  })

  socket.on("sendMessage", (message, callback) => {
    const user = getUser(socket.id);
    console.log("🚀 ~ file: index.js ~ line 66 ~ socket.on ~ user", user, message)
    const filter = new Filter();

    if (filter.isProfane(message)) {
      return callback("Profanity is not allowed!");
    } else {
      if(user !== undefined){
        io.to(user.room).emit("message", generateMessage(user.username, message, user.room));
        callback();
      }
    }
  });

  socket.on("sendLocation", (coords, callback) => {
    const user = getUser(socket.id);
    io.to(user.room).emit("locationMessage", generateLocationMessage(user.username, `https://www.google.com/maps?q=${coords.latitude},${coords.longitude}`));
    callback();
  });

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);

    if (user) {
      io.to(user.room).emit("message", generateMessage("Admin", `${user.username} has left!`));
      io.to(user.room).emit("roomData", {
        room: user.room,
        users: getUsersInRoom(user.room)
      });
    }
  });
});

server.listen(port, () => {
  console.log(`Server is up on port ${port}!`);
});
