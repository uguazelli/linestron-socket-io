// Express JS
const app = require("express")();
// Socket IO
const http = require("http").Server(app);
const io = require("socket.io")(http, { cors: { origin: "*", methods: ["GET", "POST"] } });
const registerRoomHandlers = require("./roomHandlers");

// Routes
app.get("/", (req, res, next) => res.sendFile("./index.html", { root: __dirname }));

// Socket Handlers
io.on("connection", (socket) => {
	registerRoomHandlers(io, socket);
});
// Socket error handler
io.on("connection_error", (err) => {
	console.log(err.req); // the request object
	console.log(err.code); // the error code, for example 1
	console.log(err.message); // the error message, for example "Session ID unknown"
	console.log(err.context); // some additional error context
});

// Start App
const PORT = process.env.PORT || 3000;
http.listen(PORT, function () {
	console.log("listening on *:3000");
});
