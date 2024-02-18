const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const cors = require('cors');

// CORS middleware
app.use((req, res, next) => {
  console.log('CORS middleware executed!');
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

// SQLite database setup
const db = new sqlite3.Database('./db/database.sqlite');
db.serialize(() => {
  db.run('CREATE TABLE IF NOT EXISTS messages (id INTEGER PRIMARY KEY, text TEXT, sender TEXT, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP)');
});

io.on('connection', (socket) => {
  console.log('New client connected');

  // Fetch chat history from database
  db.all('SELECT * FROM messages', (err, rows) => {
    if (err) {
      console.error(err.message);
    } else {
      socket.emit('messageHistory', rows);
    }
  });

  socket.on('message', (message) => {
    console.log('Message received:', message);
    // Insert message into database
    db.run('INSERT INTO messages (text, sender) VALUES (?, ?)', [message.text, message.sender], (err) => {
      if (err) {
        console.error(err.message);
      } else {
        io.emit('message', message); // Broadcast message to all clients
      }
    });

    // Echo back the same message to the client
    socket.emit('message', message);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

app.use(cors());

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
