import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

class Middleware {
  handleValidationError(req: Request, res: Response, next: NextFunction) {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(403).json({
        statusCode: 902101,
        userMessage: `Validation Error ${
          error?.array()[0].msg ? "- " + error?.array()[0].msg : ""
        }`,
        error: error.array()[0],
      });
    }
    next();
  }
}

export default new Middleware();
