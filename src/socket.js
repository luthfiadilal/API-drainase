let io;

module.exports = {
  init: (httpServer) => {
    const { Server } = require('socket.io');
    io = new Server(httpServer, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST']
      },
      transports: ['websocket']
    });
    
    io.on('connection', (socket) => {
      console.log('Client connected:', socket.id);
      
      socket.on('join_report', (reportId) => {
        const room = `report_${reportId}`;
        socket.join(room);
        console.log(`Socket ${socket.id} joined room ${room}`);
      });
      
      socket.on('leave_report', (reportId) => {
        const room = `report_${reportId}`;
        socket.leave(room);
        console.log(`Socket ${socket.id} left room ${room}`);
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
      });
    });
    
    return io;
  },
  getIO: () => {
    if (!io) {
      throw new Error('Socket.io is not initialized!');
    }
    return io;
  }
};
