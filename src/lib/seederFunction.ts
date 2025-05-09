import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { mongoParamsDTO } from "../dtos/mongo.dtos";
import {
  masterExpensenseTypeSeeder,
  masterIncomeTypeSeeder,
  masterRewardSeeder,
  masterSavingsTypeSeeder,
} from "../db/seeders";

//list of all the seeds
//order is important
//seeds will run in the given order
const seeds = [
  masterExpensenseTypeSeeder,
  masterIncomeTypeSeeder,
  masterSavingsTypeSeeder,
  masterRewardSeeder,
];

export const uploadSeeds = async (exit = true) => {
  const dbUrl = process.env.MONGO_URL || "mongodb://localhost:27017";
  const mongoCertificatePath = process.env.MONGO_CERTIFICATE_PATH || null;

  //if certificate path is provided add ssl properties as mongo params
  let mongoParams: mongoParamsDTO = {};

  if (mongoCertificatePath) {
    mongoParams.tlsCAFile = path.join(__dirname, mongoCertificatePath);
    mongoParams.directConnection = true;
    mongoParams.ssl = true;
    mongoParams.tls = true;
  }

  //if db is not connected connect to db then run the seeds
  if (mongoose.connection.readyState !== 1)
    await mongoose.connect(dbUrl, mongoParams);
  await runSeeds(exit);
};

const runSeeds = async (exit = true) => {
  try {
    let seedFiles: string[] = [];
    //if --files flag is passed in the command then only run seeds for the specified files
    //if --files flag is passed but no files are specified then run seed for all files
    if (process.argv.indexOf("--files") > -1)
      seedFiles = process.argv.slice(process.argv.indexOf("--files") + 1);
    if (seedFiles.length > 0) {
      for (const fileName of seedFiles) {
        //check if the provided file exists in seed list
        const runSeed = seeds.filter(
          (item) =>
            item.constructor.name.toLocaleLowerCase() ===
            fileName.toLocaleLowerCase()
        );
        if (runSeed.length > 0) {
          let seed = runSeed[0];
          let run = true;
          //if --drop flag is passed then empty the table
          if (process.argv.indexOf("--drop") > -1) await seed.drop();
          //else check if the table is empty
          else run = await seed.shouldRun();
          if (run) {
            console.log("Running", seed.constructor.name);
            //run the seed
            await seed.run();
          } else {
            console.log("Skipped", seed.constructor.name);
          }
        } else {
          console.log(`Seeder File ${fileName} not found`);
        }
      }
    } else {
      for (const seed of seeds) {
        let run = true;
        //if --drop flag is passed then empty the table
        if (process.argv.indexOf("--drop") > -1) await seed.drop();
        //else check if the table is empty
        else run = await seed.shouldRun();
        if (run) {
          console.log("Running", seed.constructor.name);
          //run the seed
          await seed.run();
        } else {
          console.log("Skipped", seed.constructor.name);
        }
      }
    }

    console.log("Seeding Complete!!");
    //exit if run from command line
    if (exit) process.exit(0);
  } catch (error) {
    console.log("Seed Error", error);
    process.exit(1);
  }
};
