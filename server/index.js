// ================================
// PIXEL WORLD RPG - Server
// ================================
const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http, {
  cors: { origin: "*" },
});

app.use(express.static("./"));

const players = {};
const tombstones = []; // Stores where players died!

io.on("connection", (socket) => {
  console.log("Player connected:", socket.id);

  players[socket.id] = {
    id: socket.id,
    x: 400,
    y: 300,
    level: 1,
    name: "Player",
    dimension: 0,
  };

  // Send existing players + tombstones to new player
  socket.emit("currentPlayers", players);
  socket.emit("currentTombstones", tombstones);

  // Tell everyone about new player
  socket.broadcast.emit("newPlayer", players[socket.id]);

  // Player moved
  socket.on("playerMoved", (data) => {
    if (players[socket.id]) {
      players[socket.id].x = data.x;
      players[socket.id].y = data.y;
      players[socket.id].dimension = data.dimension;
      socket.broadcast.emit("playerMoved", {
        id: socket.id,
        x: data.x,
        y: data.y,
        dimension: data.dimension,
      });
    }
  });

  // Player died — save their tombstone!
  socket.on("playerDied", (data) => {
    const tombstone = {
      x: data.x,
      y: data.y,
      name: data.name,
      level: data.level,
      class: data.class,
      dimension: data.dimension,
      time: new Date().toLocaleTimeString(),
    };
    tombstones.push(tombstone);
    // Tell everyone to show this tombstone
    io.emit("newTombstone", tombstone);
    console.log(data.name + " died at " + data.x + "," + data.y);
  });

  // Player switched dimension
  socket.on("dimensionChanged", (data) => {
    if (players[socket.id]) {
      players[socket.id].dimension = data.dimension;
    }
    socket.broadcast.emit("playerDimensionChanged", {
      id: socket.id,
      dimension: data.dimension,
    });
  });

  // Chat message
  socket.on("chatMessage", (msg) => {
    io.emit("chatMessage", {
      id: socket.id,
      name: players[socket.id]?.name || "Unknown",
      message: msg,
    });
  });

  // Set name
  socket.on("setName", (name) => {
    if (players[socket.id]) {
      players[socket.id].name = name;
      socket.broadcast.emit("playerNameChanged", {
        id: socket.id,
        name,
      });
    }
  });

  // Disconnect
  socket.on("disconnect", () => {
    delete players[socket.id];
    io.emit("playerDisconnected", socket.id);
    console.log("Player disconnected:", socket.id);
  });
});

http.listen(3000, () => {
  console.log("================================");
  console.log("Game server running!");
  console.log("Open http://localhost:3000");
  console.log("================================");
});
