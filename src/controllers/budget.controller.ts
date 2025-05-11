import { Request, Response } from "express";
import { BudgetService, MasterExpenseTypeService } from "../services";
import {
  addBudgetDTO,
  editBudgetDTO,
  sortBudgetDTO,
} from "../dtos/budget.dtos";

class BudgetController {
  /***************************************** CRUD APIS START *********************************************/
  async getAll(req: Request, res: Response) {
    try {
      const { month, year } = req.params;

      // monthly data query
      let whereQuery = {
        month: parseInt(month),
        year: parseInt(year),
      };

      // sort
      let sort = req.query.sort || { createdAt: -1 };
      let sortBy: sortBudgetDTO = {};

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
        // sortby created date
        else {
          sortBy.createdAt = -1;
        }
      } else {
        sortBy.createdAt = -1;
      }

      const data = await BudgetService.getAll(whereQuery, sortBy);

      return res.status(200).json({
        statusCode: 107101,
        userMessage: "Data fetched",
        message: "Data fetched successfully",
        data: data,
      });
    } catch (e) {
      console.log("error => ", e);
      return res.status(500).json({
        statusCode: 107102,
        userMessage: "Server Error",
        error: `Failed to fetch data`,
      });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const data = await BudgetService.getById(id);
      if (data) {
        return res.status(200).json({
          statusCode: 107201,
          userMessage: "Data fetched",
          message: "Data fetched successfully",
          data: data,
        });
      } else {
        return res.status(404).json({
          statusCode: 107202,
          userMessage: "Budget does not exist",
          error: "Data not found",
        });
      }
    } catch (e) {
      console.log("error => ", e);
      return res.status(500).json({
        statusCode: 107203,
        userMessage: "Server Error",
        error: "Failed to fetch data",
      });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const { category, description, amount, month, year } = req.body;

      // check if category exists
      const checkCategory = await MasterExpenseTypeService.checkData({
        name: category,
        isDeleted: false,
      });
      if (!checkCategory) {
        return res.status(404).json({
          statusCode: 107301,
          userMessage: `Category not found`,
          error: "Category not found",
        });
      }

      let payload: addBudgetDTO = {
        category,
        description,
        amount,
        month,
        year,
      };

      const data = await BudgetService.create(payload);
      return res.status(200).json({
        statusCode: 107302,
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
          statusCode: 107303,
          userMessage: `Similar budget already exists`,
          error: `The data with the specified ${duplicatedField}: ${duplicatedValue} already exists`,
        });
      }
      return res.status(500).json({
        statusCode: 107304,
        userMessage: `Server Error`,
        error: "Failed to create data",
      });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { category, description, amount, month, year } = req.body;

      //check if budget exists
      const checkData = await BudgetService.checkData({
        _id: id,
        isDeleted: false,
      });
      if (checkData) {
        // check if category exists
        if (category) {
          const checkCategory = await MasterExpenseTypeService.checkData({
            name: category,
            isDeleted: false,
          });
          if (!checkCategory) {
            return res.status(404).json({
              statusCode: 107401,
              userMessage: `Category not found`,
              error: "Category not found",
            });
          }
        }

        let payload: editBudgetDTO = {
          category,
          description,
          amount,
          month,
          year,
        };

        const data = await BudgetService.update(id, payload);
        if (data) {
          return res.status(200).json({
            statusCode: 107402,
            userMessage: `Updation completed`,
            message: "Data updated successfully",
            data: data,
          });
        } else {
          return res.status(400).json({
            statusCode: 107403,
            userMessage: `Updation failed`,
            error: "Failed to update data",
          });
        }
      } else {
        return res.status(404).json({
          statusCode: 107404,
          userMessage: `Budget does not exist`,
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
          statusCode: 107405,
          userMessage: `Similar budget already exist`,
          error: `The data with the specified ${duplicatedField}: ${duplicatedValue} already exists`,
        });
      }
      return res.status(500).json({
        statusCode: 107406,
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
      //check if budget type exists
      const checkData = await BudgetService.checkData({
        _id: id,
        ...includeDelete,
      });

      if (checkData) {
        //if hard is true hard delete, else soft delete
        if (hard === "true") {
          const data = await BudgetService.delete(id);
          if (data) {
            return res.status(200).json({
              statusCode: 107501,
              userMessage:
                "Deletion successful, This action cannot be reverted",
              message: "Data hard deleted successfully",
            });
          } else {
            return res.status(400).json({
              statusCode: 107502,
              userMessage: "Deletion failed",
              error: "Failed to hard delete data",
            });
          }
        } else {
          const data = await BudgetService.remove(id);
          if (data) {
            return res.status(200).json({
              statusCode: 107503,
              userMessage: "Deletion successful",
              message: "Data deleted successfully",
            });
          } else {
            return res.status(400).json({
              statusCode: 107504,
              userMessage: "Deletion failed",
              error: "Failed to delete data",
            });
          }
        }
      } else {
        return res.status(404).json({
          statusCode: 107505,
          userMessage: "Budget does not exist",
          error: "Data not found",
        });
      }
    } catch (e) {
      console.log("error => ", e);
      return res.status(500).json({
        statusCode: 107506,
        userMessage: "Server Error",
        error: "Failed to delete data",
      });
    }
  }
  /********************************************* CRUD APIS END *********************************************/

  /********************************************* CUSTOM APIS START *********************************************/
  async getUnusedBudgetCategories(req: Request, res: Response) {
    try {
      const { month, year } = req.params;

      let budgetWhereQuery = {
        month: parseInt(month),
        year: parseInt(year),
      };

      const getUsedCategories = await BudgetService.getDistinctUsedCategories(
        budgetWhereQuery
      );
      const data = await MasterExpenseTypeService.getAll({
        name: { $nin: getUsedCategories },
      });

      return res.status(200).json({
        statusCode: 107601,
        userMessage: "Data fetched",
        message: "Data fetched successfully",
        data: data,
      });
    } catch (e) {
      console.log("error => ", e);
      return res.status(500).json({
        statusCode: 107602,
        userMessage: "Server Error",
        error: `Failed to fetch data`,
      });
    }
  }
  /********************************************* CUSTOM APIS END *********************************************/
}

export default new BudgetController();
