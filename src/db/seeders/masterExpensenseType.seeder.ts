import { masterExpenseTypeModel } from "../models";

//data to be inserted into the table
const data = [
  {
    name: "Groceries",
  },
  {
    name: "Loan",
  },
  {
    name: "Medical",
  },
  {
    name: "Transportation",
  },
  {
    name: "Shopping",
  },
  {
    name: "Housing",
  },
  {
    name: "Other",
  },
];

class MasterCountsSeeder {
  //check if table is empty
  async shouldRun() {
    return masterExpenseTypeModel
      .countDocuments()
      .exec()
      .then((count) => count === 0);
  }

  //add data
  async run() {
    return masterExpenseTypeModel.create(data);
  }

  //empty table
  async drop() {
    return masterExpenseTypeModel.deleteMany();
  }
}

export default new MasterCountsSeeder();
