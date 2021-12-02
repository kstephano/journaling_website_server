const server = require('./app');
const { readFromFile, writeToFile } = require('./helpers/readWrite');

const port = process.env.PORT || 3000;
readFromFile();

// start the server
server.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
  // set the server to save to file every 10 seconds
  // setInterval(writeToFile, 10000);
});

