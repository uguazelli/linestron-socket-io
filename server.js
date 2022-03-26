// Express JS
const app = require("express")();
const bodyParser = require("body-parser");
// Socket IO
const http = require("http").Server(app);
const io = require("socket.io")(http, { cors: { origin: "*", methods: ["GET", "POST"] } });
const registerRoomHandlers = require("./roomHandlers");

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// Routes
app.get("/", async (req, res, next) => {
	return res.json({ message: "Welcome" });
});

app.post("/lastnumber", async (req, res, next) => {
	const roomId = req.body.roomId;
	const numberGenerated = req.body.numberGenerated;
	emitToRoomAdmin(roomId, numberGenerated);
	return res.json({ ok: true });
});

app.get("/company/:companySlug/room/:roomUniqueName", (req, res, next) =>
	res.sendFile("./index.html", { root: __dirname })
);

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

// Emit to Room Admin
const emitToRoomAdmin = (roomId, numberGenerated) => {
	const roomAdminName = `room_admin_${roomId}`;
	io.emit(roomAdminName, numberGenerated);
};
// Start App
const PORT = process.env.PORT || 9000;
http.listen(PORT, function () {
	console.log("listening on *:9000");
});
