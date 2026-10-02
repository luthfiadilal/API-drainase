require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 5000;
const http = require('http');

const server = http.createServer(app);
const socket = require('./socket');
socket.init(server);

server.listen(PORT, () => {
  console.log(`[Server] API is running on http://localhost:${PORT}`);
});
