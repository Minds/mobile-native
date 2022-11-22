/* eslint-disable prettier/prettier */
const express = require('express');
const app = express();

const SSE_RESPONSE_HEADER = {
  Connection: 'keep-alive',
  'Content-Type': 'text/event-stream',
  'Cache-Control': 'no-cache',
  'X-Accel-Buffering': 'no',
};

const users = {};

app.get('/sse/:userId', function (req, res) {
  const userId = getUserId(req);
  let data;
  users[userId] = req;

  res.writeHead(200, SSE_RESPONSE_HEADER);

  // Interval loop
  let intervalId = setInterval(function () {
    console.log(`*** Interval loop. userId: "${userId}"`);
    // Creates sending data:
    data = {
      userId,
      users: Object.keys(users).length,
      memoryUsage: process.memoryUsage(),
      time: new Date().getTime(),
    };
    // Note:
    // For avoidance of client's request timeout,
    // you should send a heartbeat data like ':\n\n' (means "comment") at least every 55 sec (30 sec for first time request)
    // even if you have no sending data:
    if (!data) {
      res.write(':\n\n');
    } else {
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    }
  }, 3000);

  // Note: Heatbeat for avoidance of client's request timeout of first time (30 sec)
  res.write(':\n\n');

  req.on('close', function () {
    console.log(`*** Close. userId: "${getUserId(req)}"`);
    // Breaks the interval loop on client disconnected
    clearInterval(intervalId);
    // Remove from connections
    delete users[userId];
  });

  req.on('end', function () {
    console.log(`*** End. userId: "${getUserId(req)}"`);
  });
});

// app.get('/', (req, res) => {
//   res.send('Hello World!');
// });

app.listen(3000, () => {
  console.log(`Example app listening on port ${3000}`);
});

function getUserId(req) {
  // Note:
  // In reality, you should use userId stored in req.session,
  // but not URI parameter.
  return req.params.userId ?? 'default-user';
}
