// const { Server } = require('socket.io');
// import app from "src/main";

// const http = require('http');
// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: '*'
//   }
// });

// io.on("connection", (socket) => {
//   console.log("New client connected", socket.id);
//   socket.join("room123  ");

//   socket.on('message', message => {
//     console.log(message);
//     io.emit('message-receive', message);
//   });

//   socket.on('new-path', message => {
//     console.log(message);
//     io.emit('new-path', message);
//   });

//   socket.on('draw', message => {
//     console.log(message);
//     io.emit('draw', message);
//   });
// });


// server.listen(8001);