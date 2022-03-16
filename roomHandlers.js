module.exports = (io, socket) => {
	let lastRoomMessage = [];

	const createMessages = (msg) => {
		const index = lastRoomMessage.findIndex((e) => e.roomName === msg.room);

		if (index === -1) {
			const obj = {
				roomName: msg.room,
				number: msg.value,
				currentTime: Date.now(),
				previousTime: Date.now(),
			};
			lastRoomMessage.push(obj);
			return obj;
		} else {
			const obj = {
				roomName: msg.room,
				number: msg.value,
				currentTime: Date.now(),
				previousTime: lastRoomMessage[index].currentTime,
			};
			lastRoomMessage[index] = obj;
			return obj;
		}
	};

	socket.on("disconnect", function () {
		console.log("A user disconnected");
	});

	// Join Room
	socket.on("connectToRoom", (room) => {
		socket.join(room);
		// io.emit(room, lastRoomMessage[room]);
		console.log("Joing room", room);
	});

	// Emit to Room
	socket.on("emmitToRoom", (msg) => {
		const messageObj = createMessages(msg);
		io.emit(msg.room, messageObj);
		console.log(msg);
	});
};
