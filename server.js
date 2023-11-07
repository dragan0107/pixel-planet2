const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');
const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');

const prisma = new PrismaClient();
const app = express();
const server = createServer(app);
const io = new Server(server);
app.use(express.static(__dirname + '/public'));



async function main() {
  // ... you will write your Prisma Client queries here

  const pixels = await prisma.pixel.findMany();
  console.log(pixels);
}

async function writeInDb(obj) {
  // ... you will write your Prisma Client queries here
  await prisma.pixel.create({
    data: obj,
  });
}
app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});

app.get('/pixels', async (req, res) => {
  const pixels = await prisma.pixel.findMany();
  res.json(pixels);
});
io.on('connection', (socket) => {
  socket.on('pixelData', (data) => {
    socket.broadcast.emit('pixelData', data);
    writeInDb(data);
  });
});

server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});


