import { Request, Response } from "express";
import {
  MasterExpenseTypeService,
  MasterIncomeTypeService,
  MasterRewardService,
  MasterSavingsTypeService,
} from "../services";

class CommonController {
  async getAllMaster(req: Request, res: Response) {
    try {
      const [expenseTypes, incomeTypes, savingsTypes, rewards] =
        await Promise.all([
          MasterExpenseTypeService.getAll(),
          MasterIncomeTypeService.getAll(),
          MasterSavingsTypeService.getAll(),
          MasterRewardService.getAll(),
        ]);

      return res.status(200).json({
        statusCode: 106101,
        userMessage: "Data fetched",
        message: "Data fetched successfully",
        data: {
          expenseTypes,
          incomeTypes,
          savingsTypes,
          rewards,
        },
      });
    } catch (e) {
      console.log("error => ", e);
      return res.status(500).json({
        statusCode: 106102,
        userMessage: "Server Error",
        error: `Failed to fetch data`,
      });
    }
  }
}

export default new CommonController();
