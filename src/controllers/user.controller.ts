import { Request, Response } from "express";
import { CognitoService, UserService } from "../services";
import { addUserDTO, editUserDTO } from "../dtos/user.dtos";
class UserController {
  /***************************************** CRUD APIS START *********************************************/

  async getAll(req: Request, res: Response) {
    try {
      //pagination parameters
      const page: number = parseInt(req.query.page as string, 10) || 1;
      const limit: number = parseInt(req.query.limit as string, 10) || 10;
      const skip = (page - 1) * limit;

      const data = await UserService.getAll(skip, limit);

      return res.status(200).json({
        statusCode: 101101,
        userMessage: "Data fetched",
        message: "Data fetched successfully",
        data: data,
      });
    } catch (e) {
      console.log("error => ", e);
      return res.status(500).json({
        statusCode: 101102,
        userMessage: "Server Error",
        error: `Failed to fetch data`,
      });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const data = await UserService.getById(id);
      if (data) {
        return res.status(200).json({
          statusCode: 101201,
          userMessage: "Data fetched",
          message: "Data fetched successfully",
          data: data,
        });
      } else {
        return res.status(404).json({
          statusCode: 101202,
          userMessage: "User does not exist",
          error: "Data not found",
        });
      }
    } catch (e) {
      console.log("error => ", e);
      return res.status(500).json({
        statusCode: 101203,
        userMessage: "Server Error",
        error: "Failed to fetch data",
      });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const { name, email } = req.body;

      //create cognito user
      const userResponse = await CognitoService.createCognitoUser(email, [
        {
          Name: "email",
          Value: email,
        },
        {
          Name: "email_verified",
          Value: "true",
        },
      ]);
      if (!userResponse) {
        return res.status(400).json({
          statusCode: 101301,
          userMessage: `Failed to create user`,
          error: "Failed to create cognito user",
        });
      }

      const cognitoIdData = userResponse.User?.Attributes?.find(
        (item) => item.Name === "sub"
      );
      if (cognitoIdData?.Value) {
        const cognitoId = cognitoIdData.Value;

        //add user to db
        let payload: addUserDTO = {
          name,
          email,
          cognitoId,
        };
        const data = await UserService.create(payload);

        return res.status(200).json({
          statusCode: 101302,
          userMessage: `Creation completed`,
          message: "Data created successfully",
          data: data,
        });
      } else {
        return res.status(400).json({
          statusCode: 101303,
          userMessage: `Creation failed`,
          error: "Failed to create cognito user",
        });
      }
    } catch (e: any) {
      console.log("error => ", e);
      // cognito user already exists
      if (e?.__type === "UsernameExistsException")
        return res.status(403).json({
          statusCode: 101304,
          userMessage: `Creation failed`,
          error: "Email already exists",
        });
      if (e?.code === 11000) {
        // Extract the duplicated field(s) from the error
        const duplicatedField = Object.keys(e.keyPattern)[0]; // Getting the first duplicated field
        const duplicatedValue = e.keyValue[duplicatedField]; // Getting the value that caused duplication
        return res.status(422).json({
          statusCode: 101305,
          userMessage: `Similar user already exists`,
          error: `The data with the specified ${duplicatedField}: ${duplicatedValue} already exists`,
        });
      }
      return res.status(500).json({
        statusCode: 101306,
        userMessage: `Server Error`,
        error: "Failed to create data",
      });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name } = req.body;

      //check if user exists
      const checkData = await UserService.checkData({
        _id: id,
        isDeleted: false,
      });
      if (checkData) {
        let payload: editUserDTO = {
          name,
        };

        const data = await UserService.update(id, payload);
        if (data) {
          return res.status(200).json({
            statusCode: 101401,
            userMessage: `Updation completed`,
            message: "Data updated successfully",
            data: data,
          });
        } else {
          return res.status(400).json({
            statusCode: 101402,
            userMessage: `Updation failed`,
            error: "Failed to update data",
          });
        }
      } else {
        return res.status(404).json({
          statusCode: 101403,
          userMessage: `User does not exist`,
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
          statusCode: 101404,
          userMessage: `Similar User already exist`,
          error: `The data with the specified ${duplicatedField}: ${duplicatedValue} already exists`,
        });
      }
      return res.status(500).json({
        statusCode: 101405,
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
      //check if user exists
      const checkData = await UserService.checkData({
        _id: id,
        ...includeDelete,
      });

      if (checkData) {
        //if hard is true hard delete, else soft delete
        if (hard === "true") {
          const cognitoData = await CognitoService.deleteCognitoUser(
            checkData.email
          );
          if (!cognitoData) {
            return res.status(400).json({
              statusCode: 101501,
              userMessage: "Deletion failed",
              error: "Failed to delete cognito user",
            });
          }

          const data = await UserService.delete(id);
          if (data) {
            return res.status(200).json({
              statusCode: 101502,
              userMessage:
                "Deletion successful, This action cannot be reverted",
              message: "Data hard deleted successfully",
            });
          } else {
            return res.status(400).json({
              statusCode: 101503,
              userMessage: "Deletion failed",
              error: "Failed to hard delete data",
            });
          }
        }

        //do not delete from cognito if soft deleting
        else {
          const data = await UserService.remove(id);
          if (data) {
            return res.status(200).json({
              statusCode: 101504,
              userMessage: "Deletion successful",
              message: "Data deleted successfully",
            });
          } else {
            return res.status(400).json({
              statusCode: 101505,
              userMessage: "Deletion failed",
              error: "Failed to delete data",
            });
          }
        }
      } else {
        return res.status(404).json({
          statusCode: 101506,
          userMessage: "User does not exist",
          error: "Data not found",
        });
      }
    } catch (e) {
      console.log("error => ", e);
      return res.status(500).json({
        statusCode: 101507,
        userMessage: "Server Error",
        error: "Failed to delete data",
      });
    }
  }
  /********************************************* CRUD APIS END *********************************************/

  /********************************************* COGNITO APIS START *********************************************/
  //set cognito user password should only be used by the same user. No other users should be able to set password
  async setCognitoUserPassword(req: Request, res: Response) {
    try {
      const { username, password } = req.body;
      //check user in db
      const checkUser = UserService.checkData({
        email: username,
        isDeleted: false,
      });
      if (!checkUser) {
        return res.status(404).json({
          statusCode: 101601,
          userMessage: "User does not exist",
          error: "User not found",
        });
      }
      //set password in cognito
      await CognitoService.setUserPassword(username, password);

      return res.status(200).json({
        statusCode: 101602,
        userMessage: "Set password success",
        message: "Congito User password set successfully",
      });
    } catch (e: any) {
      console.log("error => ", e);
      //user not found in cognito
      if (e?.__type === "UserNotFoundException")
        return res.status(404).json({
          statusCode: 101603,
          userMessage: "User does not exist",
          error: "User not found",
        });
      return res.status(500).json({
        statusCode: 101604,
        userMessage: "Server Error",
        error: "Failed to set cognito user password",
      });
    }
  }

  async cognitoSignin(req: Request, res: Response) {
    try {
      const { username, password } = req.body;
      const userResponse = await CognitoService.cognitoSignin(
        username,
        password
      );
      if (userResponse.AuthenticationResult?.AccessToken) {
        const data = await UserService.checkData({
          email: username,
          isDeleted: false,
        });

        //user found
        if (data) {
          return res.status(200).json({
            statusCode: 101702,
            userMessage: "Signed In",
            message: "User signed in",
            token: userResponse.AuthenticationResult?.AccessToken,
            data: data,
          });
        }

        //user not found
        else {
          return res.status(404).json({
            statusCode: 101703,
            userMessage: "User does not exist",
            error: "User not found",
          });
        }
      }

      // user not in cognito
      else {
        return res.status(404).json({
          statusCode: 101704,
          userMessage: "User does not exist",
          error: "Cognito user not found",
        });
      }
    } catch (e: any) {
      console.log("error => ", e);
      //incorrect password or email
      if (e?.__type === "NotAuthorizedException")
        return res.status(401).json({
          statusCode: 101705,
          userMessage: "Incorrect username or password",
          error: "Incorrect username or password",
        });
      return res.status(500).json({
        statusCode: 101706,
        userMessage: "Server Error",
        error: "Failed to sign in cognito user",
      });
    }
  }
  /********************************************* COGNITO APIS END *********************************************/
}

export default new UserController();
