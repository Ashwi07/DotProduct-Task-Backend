import { Request, Response } from "express";
import {
  TransactionService,
  MasterExpenseTypeService,
  MasterIncomeTypeService,
  MasterSavingsTypeService,
} from "../services";
import {
  addTransactionDTO,
  checkTransactionDTO,
  checkTransactionSearchTermDTO,
  editTransactionDTO,
  sortTransactionDTO,
} from "../dtos/transaction.dtos";

class TransactionController {
  /***************************************** CRUD APIS START *********************************************/
  async getAll(req: Request, res: Response) {
    try {
      const page: number = parseInt(req.query.page as string, 10) || 1;
      const limit: number = parseInt(req.query.limit as string, 10) || 10;
      const skip = (page - 1) * limit;
      const { month, year } = req.params;
      let searchTerm = req.query.searchTerm || "";
      let search: checkTransactionSearchTermDTO = {};

      const startDate = new Date(parseInt(year), parseInt(month), 1);
      const endDate = new Date(parseInt(year), parseInt(month) + 1, 1);

      let whereQuery: checkTransactionDTO = {
        transactionDate: {
          $lt: endDate,
          $gte: startDate,
        },
      };

      search.$or = [
        {
          name: {
            $regex: new RegExp(JSON.parse(JSON.stringify(searchTerm)), "i"),
          },
        },
        {
          description: {
            $regex: new RegExp(JSON.parse(JSON.stringify(searchTerm)), "i"),
          },
        },
      ];

      // sort
      let sort = req.query.sort || { createdAt: -1 };
      let sortBy: sortTransactionDTO = {};
      if (sort && typeof sort == "string") {
        sort = decodeURIComponent(sort);
        // sort by amount
        if (
          JSON.parse(sort)?.amount &&
          (JSON.parse(sort)?.amount === "ascend" ||
            JSON.parse(sort)?.amount === "descend")
        ) {
          sortBy.amount = JSON.parse(sort).amount === "ascend" ? 1 : -1;
        }
        // sort by transactionDate
        else if (
          JSON.parse(sort)?.transactionDate &&
          (JSON.parse(sort)?.transactionDate === "ascend" ||
            JSON.parse(sort)?.transactionDate === "descend")
        ) {
          sortBy.transactionDate =
            JSON.parse(sort).transactionDate === "ascend" ? 1 : -1;
        }
        // sortby created date
        else {
          sortBy.createdAt = -1;
        }
      } else {
        sortBy.createdAt = -1;
      }

      let filter = req.query.filter || {};
      if (filter && typeof filter == "string") {
        filter = decodeURIComponent(filter);
        // filter category
        if (
          JSON.parse(filter)?.category &&
          Array.isArray(JSON.parse(filter)?.category) &&
          JSON.parse(filter)?.category.length > 0
        ) {
          whereQuery.category = { $in: JSON.parse(filter).category };
        }

        // filter sub category
        if (
          JSON.parse(filter)?.subType &&
          Array.isArray(JSON.parse(filter)?.subType) &&
          JSON.parse(filter)?.subType.length > 0
        ) {
          whereQuery.subType = { $in: JSON.parse(filter).subType };
        }
      }

      const data = await TransactionService.getAll(
        whereQuery,
        search,
        sortBy,
        skip,
        limit
      );
      const total = await TransactionService.getTotalCount(whereQuery, search);

      return res.status(200).json({
        statusCode: 108101,
        userMessage: "Data fetched",
        message: "Data fetched successfully",
        data: data,
        total: total,
      });
    } catch (e) {
      console.log("error => ", e);
      return res.status(500).json({
        statusCode: 108102,
        userMessage: "Server Error",
        error: `Failed to fetch data`,
      });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const data = await TransactionService.getById(id);
      if (data) {
        return res.status(200).json({
          statusCode: 108201,
          userMessage: "Data fetched",
          message: "Data fetched successfully",
          data: data,
        });
      } else {
        return res.status(404).json({
          statusCode: 108202,
          userMessage: "Transaction does not exist",
          error: "Data not found",
        });
      }
    } catch (e) {
      console.log("error => ", e);
      return res.status(500).json({
        statusCode: 108203,
        userMessage: "Server Error",
        error: "Failed to fetch data",
      });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const { name, description, category, subType, amount, transactionDate } =
        req.body;

      if (category === "Expense") {
        const checkCategory = await MasterExpenseTypeService.checkData({
          name: subType,
          isDeleted: false,
        });
        if (!checkCategory) {
          return res.status(404).json({
            statusCode: 108301,
            userMessage: `Expense Category not found`,
            error: "Expense Category not found",
          });
        }
      } else if (category === "Income") {
        const checkCategory = await MasterIncomeTypeService.checkData({
          name: subType,
          isDeleted: false,
        });
        if (!checkCategory) {
          return res.status(404).json({
            statusCode: 108302,
            userMessage: `Income Category not found`,
            error: "Income Category not found",
          });
        }
      } else {
        const checkCategory = await MasterSavingsTypeService.checkData({
          name: subType,
          isDeleted: false,
        });
        if (!checkCategory) {
          return res.status(404).json({
            statusCode: 108303,
            userMessage: `Savings Category not found`,
            error: "Savings Category not found",
          });
        }
      }

      let payload: addTransactionDTO = {
        name,
        description,
        category,
        subType,
        amount,
        transactionDate,
      };

      const data = await TransactionService.create(payload);
      return res.status(200).json({
        statusCode: 108304,
        userMessage: `Creation completed`,
        message: "Data created successfully",
        data: data,
      });
    } catch (e: any) {
      console.log("error => ", e);
      if (e?.code === 11000) {
        // Extract the duplicated field(s) from the error
        const duplicatedField = Object.keys(e.keyPattern)[0]; // Getting the first duplicated field
        const duplicatedValue = e.keyValue[duplicatedField]; // Getting the value that caused duplication
        return res.status(422).json({
          statusCode: 108305,
          userMessage: `Similar transaction already exists`,
          error: `The data with the specified ${duplicatedField}: ${duplicatedValue} already exists`,
        });
      }
      return res.status(500).json({
        statusCode: 108306,
        userMessage: `Server Error`,
        error: "Failed to create data",
      });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, description, category, subType, amount, transactionDate } =
        req.body;

      //check if transaction exists
      const checkData = await TransactionService.checkData({
        _id: id,
        isDeleted: false,
      });
      if (checkData) {
        if (category && subType) {
          if (category === "Expense") {
            const checkCategory = await MasterExpenseTypeService.checkData({
              name: subType,
              isDeleted: false,
            });
            if (!checkCategory) {
              return res.status(404).json({
                statusCode: 108401,
                userMessage: `Expense Category not found`,
                error: "Expense Category not found",
              });
            }
          } else if (category === "Income") {
            const checkCategory = await MasterIncomeTypeService.checkData({
              name: subType,
              isDeleted: false,
            });
            if (!checkCategory) {
              return res.status(404).json({
                statusCode: 108402,
                userMessage: `Income Category not found`,
                error: "Income Category not found",
              });
            }
          } else {
            const checkCategory = await MasterSavingsTypeService.checkData({
              name: subType,
              isDeleted: false,
            });
            if (!checkCategory) {
              return res.status(404).json({
                statusCode: 108403,
                userMessage: `Savings Category not found`,
                error: "Savings Category not found",
              });
            }
          }
        }

        let payload: editTransactionDTO = {
          name,
          description,
          category,
          subType,
          amount,
          transactionDate,
        };

        const data = await TransactionService.update(id, payload);
        if (data) {
          return res.status(200).json({
            statusCode: 108404,
            userMessage: `Updation completed`,
            message: "Data updated successfully",
            data: data,
          });
        } else {
          return res.status(400).json({
            statusCode: 108405,
            userMessage: `Updation failed`,
            error: "Failed to update data",
          });
        }
      } else {
        return res.status(404).json({
          statusCode: 108406,
          userMessage: `Transaction does not exist`,
          error: "Data not found",
        });
      }
    } catch (e: any) {
      console.log("error => ", e);
      if (e?.code === 11000) {
        // Extract the duplicated field(s) from the error
        const duplicatedField = Object.keys(e.keyPattern)[0]; // Getting the first duplicated field
        const duplicatedValue = e.keyValue[duplicatedField]; // Getting the value that caused duplication

        return res.status(422).json({
          statusCode: 108407,
          userMessage: `Similar transaction already exist`,
          error: `The data with the specified ${duplicatedField}: ${duplicatedValue} already exists`,
        });
      }
      return res.status(500).json({
        statusCode: 108408,
        userMessage: `Server Error`,
        error: "Failed to update data",
      });
    }
  }

  async remove(req: Request, res: Response) {
    try {
      const { id } = req.params;
      let hard = req.query.hard;
      //isDeleted should only be passed for soft delete.
      let includeDelete: { isDeleted?: boolean } = {};
      if (hard !== "true") {
        includeDelete = { isDeleted: false };
      }
      //check if transaction type exists
      const checkData = await TransactionService.checkData({
        _id: id,
        ...includeDelete,
      });

      if (checkData) {
        //if hard is true hard delete, else soft delete
        if (hard === "true") {
          const data = await TransactionService.delete(id);
          if (data) {
            return res.status(200).json({
              statusCode: 108501,
              userMessage:
                "Deletion successful, This action cannot be reverted",
              message: "Data hard deleted successfully",
            });
          } else {
            return res.status(400).json({
              statusCode: 108502,
              userMessage: "Deletion failed",
              error: "Failed to hard delete data",
            });
          }
        } else {
          const data = await TransactionService.remove(id);
          if (data) {
            return res.status(200).json({
              statusCode: 108503,
              userMessage: "Deletion successful",
              message: "Data deleted successfully",
            });
          } else {
            return res.status(400).json({
              statusCode: 108504,
              userMessage: "Deletion failed",
              error: "Failed to delete data",
            });
          }
        }
      } else {
        return res.status(404).json({
          statusCode: 108505,
          userMessage: "Transaction does not exist",
          error: "Data not found",
        });
      }
    } catch (e) {
      console.log("error => ", e);
      return res.status(500).json({
        statusCode: 108506,
        userMessage: "Server Error",
        error: "Failed to delete data",
      });
    }
  }
  /********************************************* CRUD APIS END *********************************************/
}

export default new TransactionController();
