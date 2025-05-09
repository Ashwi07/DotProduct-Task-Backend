import { masterSavingsTypeModel } from "../models";

//data to be inserted into the table
const data = [
  {
    name: "Investments Returns",
  },
  {
    name: "Part-time",
  },
  {
    name: "Business",
  },
  {
    name: "Stocks",
  },
  {
    name: "Other",
  },
];

class MasterSavingsTypeSeeder {
  //check if table is empty
  async shouldRun() {
    return masterSavingsTypeModel
      .countDocuments()
      .exec()
      .then((count) => count === 0);
  }

  //add data
  async run() {
    return masterSavingsTypeModel.create(data);
  }

  //empty table
  async drop() {
    return masterSavingsTypeModel.deleteMany();
  }
}

export default new MasterSavingsTypeSeeder();
