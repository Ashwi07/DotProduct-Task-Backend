import express from "express";
import bodyParser from "body-parser";
import helmet from "helmet";
import { Application, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import path from "path";
import { mongoParamsDTO } from "./dtos/mongo.dtos";
import { notFoundHandler } from "./middlewares/not-found";

import { userRouter, masterExpenseTypeRouter } from "./routes";
import { uploadSeeds } from "./lib/seederFunction";

export const createServer = async (): Promise<Application> => {
  dotenv.config();
  //configure env variables
  const port = process.env.PORT || 8000;
  const dbUrl = process.env.MONGO_URL || "mongodb://localhost:27017";
  const mongoCertificatePath = process.env.MONGO_CERTIFICATE_PATH || null;
  const app: Application = express();

  //if certificate path is provided add ssl properties as mongo params
  let mongoParams: mongoParamsDTO = {};

  if (mongoCertificatePath) {
    mongoParams.tlsCAFile = path.join(__dirname, mongoCertificatePath);
    mongoParams.directConnection = true;
    mongoParams.ssl = true;
    mongoParams.tls = true;
  }

  //add headers
  app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
    next();
  });

  //add cors
  app.use(
    cors({
      origin: ["http://localhost:3000", "http://localhost:3000/*"],
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
      allowedHeaders: [
        "Content-Type",
        "Origin",
        "X-Auth-Token",
        "Accept",
        "Accept-Language",
        "Content-Language",
        "Authorization",
      ],
      exposedHeaders: ["*"],
      credentials: true,
    })
  );
  app.options("*", cors());

  app.use(
    bodyParser.urlencoded({
      extended: true,
      limit: "200mb",
      parameterLimit: 50000,
    })
  );
  app.use(bodyParser.json({ limit: "200mb" }));
  app.use(helmet());

  app.get("/", (req, res) => {
    return res.status(200).send("Hello");
  });

  //routes
  app.use("/api/user", userRouter);
  app.use("/api/master-expense-type", masterExpenseTypeRouter);
  app.use(notFoundHandler);

  interface Error {
    message?: string;
    status?: number;
  }

  app.use((err: Error, req: Request, res: Response) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    res.status(err.status || 500);
    res.send("errors");
  });

  console.log("dbUrl", dbUrl)

  //mongo connection
  mongoose
    .connect(dbUrl, mongoParams)
    .then(async () => {
      console.log("Database connection established");
      //if connection is complete upload seeds
      await uploadSeeds(false);

      //start server
      app.listen(port, () => console.log(`Server started on port ${port}`));
    })
    .catch((error) => {
      console.log(`Database connection error: ${error}`);
    });

  return app;
};

try {
  createServer();
} catch (error) {
  console.log("Error creating connection");
  console.log(error);
}
