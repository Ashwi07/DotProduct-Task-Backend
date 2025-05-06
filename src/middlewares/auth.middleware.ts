import { NextFunction, Request, Response } from "express";
// import jwt from "jsonwebtoken";
import jwkToPem from "jwk-to-pem";
import fetch from "node-fetch";
import { UserService } from "../services";
import jwt from "jsonwebtoken";
import config from "../config/config";
let pems: any = {};

class AuthMiddleware {
  constructor() {
    this.setUp();
  }

  verifyToken(req: Request, res: Response, next: NextFunction) {
    try {
      //get token and remove "Beared" keyword
      const bearer = req.header("authorization");
      const token = bearer?.split(" ")[1];
      if (token) {
        //decode token
        let decodeJwt: any = jwt.decode(token, { complete: true });
        if (decodeJwt) {
          let kid = decodeJwt.header.kid;
          //check if permission exists for the kid
          let pem = pems[kid];

          //verify token with the permission for the given key
          if (pem) {
            jwt.verify(token, pem, async (err: any, payload: any) => {
              if (err) {
                if (err.name === "TokenExpiredError")
                  res
                    .status(401)
                    .json({
                      statusCode: 901101,
                      userMessage: "Token Expired",
                      error: "Token Expired",
                    })
                    .end();
                else
                  res
                    .status(401)
                    .json({
                      statusCode: 901102,
                      userMessage: "User Token verification failed",
                      error: "Cannot verify token",
                    })
                    .end();
              } else {
                //check if payload has cognito id
                if (payload.sub) {
                  //fetch the user with the cognito id from the database
                  const user = await UserService.checkData({
                    cognitoId: payload.sub,
                    isDeleted: false,
                  });

                  //add user to request
                  if (user) {
                    req.body.user = user;
                    next();
                  } else {
                    res
                      .status(401)
                      .json({
                        statusCode: 901103,
                        userMessage: "User does not exist",
                        error: "User not found",
                      })
                      .end();
                  }
                } else {
                  res
                    .status(409)
                    .json({
                      statusCode: 901104,
                      userMessage: "Failed to fetch user id",
                      error: "Couldn't fetch cognito user data",
                    })
                    .end();
                }
              }
            });
          } else {
            res
              .status(401)
              .json({
                statusCode: 901105,
                userMessage: "Invalid Token",
                error: "Unauthorized",
              })
              .end();
          }
        } else {
          res
            .status(401)
            .json({
              statusCode: 901106,
              userMessage: "Invalid Token",
              error: "Unauthorized",
            })
            .end();
        }
      } else {
        res
          .status(401)
          .json({
            statusCode: 901107,
            userMessage: "Invalid Token",
            error: "Unauthorized",
          })
          .end();
      }
    } catch (e) {
      res
        .status(500)
        .json({
          statusCode: 901108,
          userMessage: "Server Error",
          error: "Server Error",
        })
        .end();
    }
  }

  //this runs at the start of the server
  //if the userpool permissions are updated server needs to be restarted
  private async setUp() {
    if (process.env.NODE_ENV === "test") {
      return;
    }
    const region = config.region;
    const userPoolId = config.userPoolId;
    //url for userpool permissions json file
    const url = `https://cognito-idp.${region}.amazonaws.com/${userPoolId}/.well-known/jwks.json`;

    try {
      //get the json file
      const response = await fetch(url);
      if (response.status !== 200) {
        throw "response not successful";
      }
      const data: any = await response.json();
      const { keys } = data;
      //loop through keys to fetch all the permissions
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const key_id = key.kid;
        const modulus = key.n;
        const exponent = key.e;
        const key_type = key.kty;
        const jwk = { kty: key_type, n: modulus, e: exponent };
        const pem = jwkToPem(jwk);

        pems[key_id] = pem;
      }

      console.log("Permissions fetched");
    } catch (e) {
      console.log("Could not fetch jwks", e);
    }
  }
}

export default new AuthMiddleware();
