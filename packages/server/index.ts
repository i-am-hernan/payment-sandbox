import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import mongoose, { ConnectOptions, Mongoose } from "mongoose";
import { DATABASE_URL, SERVER_PORT } from "./config";
import { Server } from "http";
import { templateRouter } from "./routes";

// app
const app = express();

// middlewares
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

// routes
app.use("/api", templateRouter);

// cors
if (process.env.NODE_ENV === "development") {
  app.use(cors({ origin: `${process.env.CLIENT_URL}` }));
}

// db
const connectDB = () => {
  const url = DATABASE_URL;
  const options = {
    useNewUrlParser: true,
  };
  return mongoose.connect(url, <ConnectOptions>options);
};

const disconnectDB = () => {
  return mongoose.disconnect();
};

// server
const startServer = () => {
  const port = SERVER_PORT;
  let server = null;
  return new Promise<Server>((resolve, reject) => {
    server = app
      .listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
      })
      .on("error", (error) => {
        disconnectDB();
        reject(error);
      });
    resolve(server);
  });
};

const closeServer = (server: Server) => {
  return new Promise<void>((resolve, reject) => {
    server.close((error) => {
      if (error) {
        return reject(error);
      }
      resolve();
    });
  });
};

// start systems
const startSystems = () => {
  return new Promise<Server>((resolve, reject) => {
    connectDB()
      .then(() => {
        console.log("DB Connected");
      })
      .then(() => {
        resolve(startServer());
      })
      .catch((error) => {
        console.error(error);
        reject(error);
      });
  });
};

// stop systems
const stopSystems = (server: Server) => {
  return new Promise<void>((resolve, reject) => {
    disconnectDB()
      .then(() => {
        resolve(closeServer(server));
      })
      .catch((error) => {
        console.error(error);
      });
  });
};

if (require.main === module) {
  startSystems()
    .then((server) => {
      console.log("Server up and running.");
      process.on("SIGTERM", () => {
        stopSystems(server);
      });
      process.on("SIGINT", () => {
        stopSystems(server);
      });
    })
    .catch((error) => {
      console.error(error);
    });
}
