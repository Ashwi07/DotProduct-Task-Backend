import { Request, Response } from "express";
import { MasterExpenseTypeService } from "../services";
import {
  addMasterExpenseTypeDTO,
  editMasterExpenseTypeDTO,
} from "../dtos/masterExpenseType.dtos";
class MasterExpenseTypeController {
  /***************************************** CRUD APIS START *********************************************/

  async getAll(req: Request, res: Response) {
    try {
      //pagination parameters
      const page: number = parseInt(req.query.page as string, 10) || 1;
      const limit: number = parseInt(req.query.limit as string, 10) || 10;
      const skip = (page - 1) * limit;

      const data = await MasterExpenseTypeService.getAll(skip, limit);

      return res.status(200).json({
        statusCode: 102101,
        userMessage: "Data fetched",
        message: "Data fetched successfully",
        data: data,
      });
    } catch (e) {
      console.log("error => ", e);
      return res.status(500).json({
        statusCode: 102102,
        userMessage: "Server Error",
        error: `Failed to fetch data`,
      });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const data = await MasterExpenseTypeService.getById(id);
      if (data) {
        return res.status(200).json({
          statusCode: 102201,
          userMessage: "Data fetched",
          message: "Data fetched successfully",
          data: data,
        });
      } else {
        return res.status(404).json({
          statusCode: 102202,
          userMessage: "Expense type does not exist",
          error: "Data not found",
        });
      }
    } catch (e) {
      console.log("error => ", e);
      return res.status(500).json({
        statusCode: 102203,
        userMessage: "Server Error",
        error: "Failed to fetch data",
      });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const { name } = req.body;

      let payload: addMasterExpenseTypeDTO = {
        name,
      };

      const data = await MasterExpenseTypeService.create(payload);
      return res.status(200).json({
        statusCode: 102301,
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
          statusCode: 102302,
          userMessage: `Similar expense type already exists`,
          error: `The data with the specified ${duplicatedField}: ${duplicatedValue} already exists`,
        });
      }
      return res.status(500).json({
        statusCode: 102303,
        userMessage: `Server Error`,
        error: "Failed to create data",
      });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name } = req.body;

      //check if expense type exists
      const checkData = await MasterExpenseTypeService.checkData({
        _id: id,
        isDeleted: false,
      });
      if (checkData) {
        let payload: editMasterExpenseTypeDTO = {
          name,
        };

        const data = await MasterExpenseTypeService.update(id, payload);
        if (data) {
          return res.status(200).json({
            statusCode: 102401,
            userMessage: `Updation completed`,
            message: "Data updated successfully",
            data: data,
          });
        } else {
          return res.status(400).json({
            statusCode: 102402,
            userMessage: `Updation failed`,
            error: "Failed to update data",
          });
        }
      } else {
        return res.status(404).json({
          statusCode: 102403,
          userMessage: `Expense Type does not exist`,
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
          statusCode: 102404,
          userMessage: `Similar Expense Type already exist`,
          error: `The data with the specified ${duplicatedField}: ${duplicatedValue} already exists`,
        });
      }
      return res.status(500).json({
        statusCode: 102405,
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
      //check if expense type exists
      const checkData = await MasterExpenseTypeService.checkData({
        _id: id,
        ...includeDelete,
      });

      if (checkData) {
        //if hard is true hard delete, else soft delete
        if (hard === "true") {
          const data = await MasterExpenseTypeService.delete(id);
          if (data) {
            return res.status(200).json({
              statusCode: 102501,
              userMessage:
                "Deletion successful, This action cannot be reverted",
              message: "Data hard deleted successfully",
            });
          } else {
            return res.status(400).json({
              statusCode: 102502,
              userMessage: "Deletion failed",
              error: "Failed to hard delete data",
            });
          }
        } else {
          const data = await MasterExpenseTypeService.remove(id);
          if (data) {
            return res.status(200).json({
              statusCode: 102503,
              userMessage: "Deletion successful",
              message: "Data deleted successfully",
            });
          } else {
            return res.status(400).json({
              statusCode: 102504,
              userMessage: "Deletion failed",
              error: "Failed to delete data",
            });
          }
        }
      } else {
        return res.status(404).json({
          statusCode: 102505,
          userMessage: "Expense Type does not exist",
          error: "Data not found",
        });
      }
    } catch (e) {
      console.log("error => ", e);
      return res.status(500).json({
        statusCode: 102506,
        userMessage: "Server Error",
        error: "Failed to delete data",
      });
    }
  }
  /********************************************* CRUD APIS END *********************************************/
}

export default new MasterExpenseTypeController();
