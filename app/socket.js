let io;

export default {
	init: httpServer => {
		io = require('socket.io')(httpServer, {
			cors: {
				origin: true,
				methods: ['GET', 'POST'],
			},
		});
		return io;
	},
	getIO: () => {
		if (!io) {
			throw new Error('Socket.io not initialized!');
		}
		return io;
	},
};
