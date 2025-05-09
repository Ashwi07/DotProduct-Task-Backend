import { masterRewardModel } from "../models";

//data to be inserted into the table
const data = [
  {
    name: "Gaming Night on Friday",
    amount: 10000,
  },
  {
    name: "Weekend Dinner",
    amount: 30000,
  },
];

class MasterRewardSeeder {
  //check if table is empty
  async shouldRun() {
    return masterRewardModel
      .countDocuments()
      .exec()
      .then((count) => count === 0);
  }

  //add data
  async run() {
    return masterRewardModel.create(data);
  }

  //empty table
  async drop() {
    return masterRewardModel.deleteMany();
  }
}

export default new MasterRewardSeeder();
