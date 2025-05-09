import { Request, Response } from "express";
import { MasterSavingsTypeService } from "../services";
import {
  addMasterSavingsTypeDTO,
  editMasterSavingsTypeDTO,
} from "../dtos/masterSavingsType.dtos";
class MasterSavingsTypeController {
  /***************************************** CRUD APIS START *********************************************/

  async getAll(req: Request, res: Response) {
    try {
      const data = await MasterSavingsTypeService.getAll();

      return res.status(200).json({
        statusCode: 104101,
        userMessage: "Data fetched",
        message: "Data fetched successfully",
        data: data,
      });
    } catch (e) {
      console.log("error => ", e);
      return res.status(500).json({
        statusCode: 104102,
        userMessage: "Server Error",
        error: `Failed to fetch data`,
      });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const data = await MasterSavingsTypeService.getById(id);
      if (data) {
        return res.status(200).json({
          statusCode: 104201,
          userMessage: "Data fetched",
          message: "Data fetched successfully",
          data: data,
        });
      } else {
        return res.status(404).json({
          statusCode: 104202,
          userMessage: "Savings type does not exist",
          error: "Data not found",
        });
      }
    } catch (e) {
      console.log("error => ", e);
      return res.status(500).json({
        statusCode: 104203,
        userMessage: "Server Error",
        error: "Failed to fetch data",
      });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const { name } = req.body;

      let payload: addMasterSavingsTypeDTO = {
        name,
      };

      const data = await MasterSavingsTypeService.create(payload);
      return res.status(200).json({
        statusCode: 104301,
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
          statusCode: 104302,
          userMessage: `Similar savings type already exists`,
          error: `The data with the specified ${duplicatedField}: ${duplicatedValue} already exists`,
        });
      }
      return res.status(500).json({
        statusCode: 104303,
        userMessage: `Server Error`,
        error: "Failed to create data",
      });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name } = req.body;

      //check if savings type exists
      const checkData = await MasterSavingsTypeService.checkData({
        _id: id,
        isDeleted: false,
      });
      if (checkData) {
        let payload: editMasterSavingsTypeDTO = {
          name,
        };

        const data = await MasterSavingsTypeService.update(id, payload);
        if (data) {
          return res.status(200).json({
            statusCode: 104401,
            userMessage: `Updation completed`,
            message: "Data updated successfully",
            data: data,
          });
        } else {
          return res.status(400).json({
            statusCode: 104402,
            userMessage: `Updation failed`,
            error: "Failed to update data",
          });
        }
      } else {
        return res.status(404).json({
          statusCode: 104403,
          userMessage: `Savings Type does not exist`,
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
          statusCode: 104404,
          userMessage: `Similar Savings Type already exist`,
          error: `The data with the specified ${duplicatedField}: ${duplicatedValue} already exists`,
        });
      }
      return res.status(500).json({
        statusCode: 104405,
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
      //check if savings type exists
      const checkData = await MasterSavingsTypeService.checkData({
        _id: id,
        ...includeDelete,
      });

      if (checkData) {
        //if hard is true hard delete, else soft delete
        if (hard === "true") {
          const data = await MasterSavingsTypeService.delete(id);
          if (data) {
            return res.status(200).json({
              statusCode: 104501,
              userMessage:
                "Deletion successful, This action cannot be reverted",
              message: "Data hard deleted successfully",
            });
          } else {
            return res.status(400).json({
              statusCode: 104502,
              userMessage: "Deletion failed",
              error: "Failed to hard delete data",
            });
          }
        } else {
          const data = await MasterSavingsTypeService.remove(id);
          if (data) {
            return res.status(200).json({
              statusCode: 104503,
              userMessage: "Deletion successful",
              message: "Data deleted successfully",
            });
          } else {
            return res.status(400).json({
              statusCode: 104504,
              userMessage: "Deletion failed",
              error: "Failed to delete data",
            });
          }
        }
      } else {
        return res.status(404).json({
          statusCode: 104505,
          userMessage: "Savings Type does not exist",
          error: "Data not found",
        });
      }
    } catch (e) {
      console.log("error => ", e);
      return res.status(500).json({
        statusCode: 104506,
        userMessage: "Server Error",
        error: "Failed to delete data",
      });
    }
  }
  /********************************************* CRUD APIS END *********************************************/
}

export default new MasterSavingsTypeController();
