const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const port = process.env.PORT || 8181;
const GcpAPI = require("./services/gcp-api.js");

http.listen(port, function() {
  console.log("Server Started. Listening on localhost:" + port);
});

const gcpAPI = new GcpAPI();

io.on("connection", socket => {
  socket.on("startStream", () => {
    console.log("startStream");
    gcpAPI.startRecognitionStream(io);
  });

  socket.on("audiodata", data => {
    console.log(data);
    gcpAPI.writingToStream(data);
  });

  socket.on("endStream", () => {
    console.log("endStream");
    gcpAPI.stopRecognitionStream();
  });
});
