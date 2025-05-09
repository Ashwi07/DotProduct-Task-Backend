import { Request, Response } from "express";
import { MasterRewardService } from "../services";
import {
  addMasterRewardDTO,
  editMasterRewardDTO,
} from "../dtos/masterReward.dtos";
class MasterRewardController {
  /***************************************** CRUD APIS START *********************************************/

  async getAll(req: Request, res: Response) {
    try {
      const data = await MasterRewardService.getAll();

      return res.status(200).json({
        statusCode: 105101,
        userMessage: "Data fetched",
        message: "Data fetched successfully",
        data: data,
      });
    } catch (e) {
      console.log("error => ", e);
      return res.status(500).json({
        statusCode: 105102,
        userMessage: "Server Error",
        error: `Failed to fetch data`,
      });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const data = await MasterRewardService.getById(id);
      if (data) {
        return res.status(200).json({
          statusCode: 105201,
          userMessage: "Data fetched",
          message: "Data fetched successfully",
          data: data,
        });
      } else {
        return res.status(404).json({
          statusCode: 105202,
          userMessage: "Reward type does not exist",
          error: "Data not found",
        });
      }
    } catch (e) {
      console.log("error => ", e);
      return res.status(500).json({
        statusCode: 105203,
        userMessage: "Server Error",
        error: "Failed to fetch data",
      });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const { name, amount } = req.body;

      let payload: addMasterRewardDTO = {
        name,
        amount,
      };

      const data = await MasterRewardService.create(payload);
      return res.status(200).json({
        statusCode: 105301,
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
          statusCode: 105302,
          userMessage: `Similar Reward type already exists`,
          error: `The data with the specified ${duplicatedField}: ${duplicatedValue} already exists`,
        });
      }
      return res.status(500).json({
        statusCode: 105303,
        userMessage: `Server Error`,
        error: "Failed to create data",
      });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, amount } = req.body;

      //check if reward type exists
      const checkData = await MasterRewardService.checkData({
        _id: id,
        isDeleted: false,
      });
      if (checkData) {
        let payload: editMasterRewardDTO = {
          name,
        };

        const data = await MasterRewardService.update(id, payload);
        if (data) {
          return res.status(200).json({
            statusCode: 105401,
            userMessage: `Updation completed`,
            message: "Data updated successfully",
            data: data,
          });
        } else {
          return res.status(400).json({
            statusCode: 105402,
            userMessage: `Updation failed`,
            error: "Failed to update data",
          });
        }
      } else {
        return res.status(404).json({
          statusCode: 105403,
          userMessage: `Reward Type does not exist`,
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
          statusCode: 105404,
          userMessage: `Similar Reward Type already exist`,
          error: `The data with the specified ${duplicatedField}: ${duplicatedValue} already exists`,
        });
      }
      return res.status(500).json({
        statusCode: 105405,
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
      //check if reward type exists
      const checkData = await MasterRewardService.checkData({
        _id: id,
        ...includeDelete,
      });

      if (checkData) {
        //if hard is true hard delete, else soft delete
        if (hard === "true") {
          const data = await MasterRewardService.delete(id);
          if (data) {
            return res.status(200).json({
              statusCode: 105501,
              userMessage:
                "Deletion successful, This action cannot be reverted",
              message: "Data hard deleted successfully",
            });
          } else {
            return res.status(400).json({
              statusCode: 105502,
              userMessage: "Deletion failed",
              error: "Failed to hard delete data",
            });
          }
        } else {
          const data = await MasterRewardService.remove(id);
          if (data) {
            return res.status(200).json({
              statusCode: 105503,
              userMessage: "Deletion successful",
              message: "Data deleted successfully",
            });
          } else {
            return res.status(400).json({
              statusCode: 105504,
              userMessage: "Deletion failed",
              error: "Failed to delete data",
            });
          }
        }
      } else {
        return res.status(404).json({
          statusCode: 105505,
          userMessage: "Reward Type does not exist",
          error: "Data not found",
        });
      }
    } catch (e) {
      console.log("error => ", e);
      return res.status(500).json({
        statusCode: 105506,
        userMessage: "Server Error",
        error: "Failed to delete data",
      });
    }
  }
  /********************************************* CRUD APIS END *********************************************/
}

export default new MasterRewardController();
