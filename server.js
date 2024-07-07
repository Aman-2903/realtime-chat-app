const express = require("express");
const app = express();
const http = require("http").createServer(app);
const path = require("path");

const PORT = process.env.PORT || 3000;

app.use(express.static("public"));

app.get("/", (req, res, next) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

http.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

//socket

const io = require("socket.io")(http);

io.on("connection", (socket) => {
  console.log("Connected....");
});
