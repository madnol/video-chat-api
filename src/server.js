require("dotenv").config();
const express = require("express");
const error_handler = require("node-error-handler");
const cors = require("cors");
const listEndpoints = require("express-list-endpoints");
const apiRoutes = require("./Routes");
const createSocketServer = require("./socket");
const mongoose = require("mongoose");
const port = process.env.PORT || 3001;
//*Server
const server = express();
const http = require("http");
const httpServer = http.createServer(server);
//*SOCKET IO CONNECTION
createSocketServer(httpServer);

//*MIDDLEWARES
server.set("trust proxy", 1);
server.enable("trust proxy");
server.use(express.json());

server.use(
  cors({
    origin: [`${process.env.FRONT_URI}`, `${process.env.FRONT_URI_PROD}`],
    // credentials: true,
    // exposedHeaders: ["set-cookie"],
  })
);
//*API ROUTE
server.use("/api", apiRoutes);

//*ERROR HANDLERS
server.use(error_handler({ log: true, debug: true }));

console.log(listEndpoints(server));
//*Connection to db and Server
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() =>
    httpServer.listen(port, () => {
      console.log("server connected at port:", port);
    })
  )
  .catch(err => console.log(err));
