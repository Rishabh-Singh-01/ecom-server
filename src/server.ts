import * as dotenv from 'dotenv';
dotenv.config();

import app from './app';

// Setting up server
const serverPort = process.env.SERVER_PORT || 8080;
const server = app.listen(serverPort, () =>
  console.log(`Server is listening on Port - ${serverPort}`)
);

export default server;
