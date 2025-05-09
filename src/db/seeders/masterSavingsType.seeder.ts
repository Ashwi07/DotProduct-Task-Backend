import { masterIncomeTypeModel } from "../models";

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

class MasterIncomeTypeSeeder {
  //check if table is empty
  async shouldRun() {
    return masterIncomeTypeModel
      .countDocuments()
      .exec()
      .then((count) => count === 0);
  }

  //add data
  async run() {
    return masterIncomeTypeModel.create(data);
  }

  //empty table
  async drop() {
    return masterIncomeTypeModel.deleteMany();
  }
}

export default new MasterIncomeTypeSeeder();
