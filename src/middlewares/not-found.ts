import { Request, Response } from "express";

export const notFoundHandler = (request: Request, response: Response) => {
  const message = "Resource not found";
  response.status(404).json({
    statusCode: 903101,
    userMessage: "Invalid Api Url",
    error: message,
  });
};
