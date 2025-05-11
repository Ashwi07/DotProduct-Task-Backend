import { Request, Response } from "express";
import {
  BudgetService,
  MasterExpenseTypeService,
  MasterIncomeTypeService,
  MasterSavingsTypeService,
  TransactionService,
} from "../services";
import { checkBudgetDTO } from "../dtos/budget.dtos";
import { checkTransactionDTO } from "../dtos/transaction.dtos";

class CommonController {
  //get all the master data
  async getAllMaster(req: Request, res: Response) {
    try {
      // complete all promises at once to reduce time
      const [expenseTypes, incomeTypes, savingsTypes] = await Promise.all([
        MasterExpenseTypeService.getAll(),
        MasterIncomeTypeService.getAll(),
        MasterSavingsTypeService.getAll(),
      ]);

      return res.status(200).json({
        statusCode: 106101,
        userMessage: "Data fetched",
        message: "Data fetched successfully",
        data: {
          expenseTypes,
          incomeTypes,
          savingsTypes,
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

  // get sub categories only
  async getSubTypes(req: Request, res: Response) {
    try {
      //commplete all primises at once to reduce time
      const [expenseTypes, incomeTypes, savingsTypes] = await Promise.all([
        MasterExpenseTypeService.getAll(),
        MasterIncomeTypeService.getAll(),
        MasterSavingsTypeService.getAll(),
      ]);

      return res.status(200).json({
        statusCode: 106201,
        userMessage: "Data fetched",
        message: "Data fetched successfully",
        data: {
          Expense: expenseTypes,
          Income: incomeTypes,
          Savings: savingsTypes,
        },
      });
    } catch (e) {
      console.log("error => ", e);
      return res.status(500).json({
        statusCode: 106202,
        userMessage: "Server Error",
        error: `Failed to fetch data`,
      });
    }
  }

  // get dashboard details
  async getDashboardDetails(req: Request, res: Response) {
    try {
      const { month, year } = req.params;

      // get selected months data
      let budgetWhereQuery: checkBudgetDTO = {
        month: parseInt(month),
        year: parseInt(year),
      };

      const startDate = new Date(parseInt(year), parseInt(month), 1);
      const endDate = new Date(parseInt(year), parseInt(month) + 1, 1);
      let transactionWhereQuery: checkTransactionDTO = {
        transactionDate: {
          $lt: endDate,
          $gte: startDate,
        },
      };

      //get all api data together
      const [budgetAmount, budgetMonth, transactionData, transactionMonth] =
        await Promise.all([
          BudgetService.getSum(budgetWhereQuery),
          BudgetService.getMonthData(budgetWhereQuery),
          TransactionService.getCategorizedSum(transactionWhereQuery),
          TransactionService.getMonthData(transactionWhereQuery),
        ]);

        // map for easier handling
      const transactionMap = new Map<string, number>();

      transactionMonth
        .filter((item) => item.category === "Expense")
        .forEach((item) => {
          transactionMap.set(
            item.subType,
            (transactionMap.get(item.subType) || 0) + item.amount
          );
        });

      const budgetMap = new Map<string, number>();
      budgetMonth.map((item) => {
        budgetMap.set(item.category, item.amount);
      });

      const allCategories = new Set<string>([
        ...Array.from(budgetMap.keys()),
        ...Array.from(transactionMap.keys()),
      ]);

      //double bar graph
      const doubleBarGraphData = Array.from(allCategories).map((category) => ({
        category,
        Budget: budgetMap.get(category) || 0,
        Expense: transactionMap.get(category) || 0,
      }));

      //stats
      const stats = [
        {
          title: "Total Budget",
          value: budgetAmount,
        },
        {
          title: "Total Income",
          value: transactionData.Income,
        },
        {
          title: "Total Expense",
          value: transactionData.Expense,
        },
        {
          title: "Total Savings",
          value: transactionData.Savings,
        },
        {
          title: "Remaining Budget",
          value: budgetAmount - transactionData.Expense,
        },
        {
          title: "Unplanned Income",
          value:
            transactionData.Income - budgetAmount - transactionData.Savings,
        },
      ];

      //single line/cumulative graph data
      const dailyExpenseMap = new Map<string, number>();
      const dailySavingsMap = new Map<string, number>();

      transactionMonth
        .filter(
          (item) => item.category === "Expense" || item.category === "Savings"
        )
        .forEach((item) => {
          const dateStr = item.transactionDate.toISOString().split("T")[0];
          if (item.category === "Expense") {
            dailyExpenseMap.set(
              dateStr,
              (dailyExpenseMap.get(dateStr) || 0) + item.amount
            );
          } else {
            dailySavingsMap.set(
              dateStr,
              (dailySavingsMap.get(dateStr) || 0) + item.amount
            );
          }
        });

      const dailyExpenseData = Array.from(
        dailyExpenseMap,
        ([date, amount]) => ({
          date,
          amount,
        })
      );
      const dailySavingsData = Array.from(
        dailySavingsMap,
        ([date, amount]) => ({
          date,
          amount,
        })
      );

      return res.status(200).json({
        statusCode: 106301,
        userMessage: "Data fetched",
        message: "Data fetched successfully",
        data: {
          stats,
          doubleBarGraphData,
          totalBudget: budgetAmount,
          dailyExpenseData,
          dailySavingsData,
        },
      });
    } catch (e) {
      console.log("error => ", e);
      return res.status(500).json({
        statusCode: 106302,
        userMessage: "Server Error",
        error: `Failed to fetch data`,
      });
    }
  }
}

export default new CommonController();
