import { body, param } from "express-validator";

class UserValidator {
  checkId() {
    return [
      param("id")
        .notEmpty()
        .withMessage("User id should not be empty")
        .bail()
        .isMongoId()
        .withMessage("Invalid Id"),
    ];
  }

  checkCreateUser() {
    return [
      body("email")
        .notEmpty()
        .withMessage("Email is required")
        .bail()
        .isEmail()
        .withMessage("Invalid Email"),
      body("name")
        .trim()
        .notEmpty()
        .withMessage("Name is required")
        .bail()
        .isString()
        .withMessage("Name must be a string"),
    ];
  }

  checkUpdateUser() {
    return [
      param("id")
        .notEmpty()
        .withMessage("User id should not be empty")
        .bail()
        .isMongoId()
        .withMessage("Invalid Id"),
      body("name")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Name is required")
        .bail()
        .isString()
        .withMessage("Name must be a string"),
    ];
  }

  checkCognitoId() {
    return [
      param("id").notEmpty().withMessage("Cognito id should not be empty"),
    ];
  }
}

export default new UserValidator();
