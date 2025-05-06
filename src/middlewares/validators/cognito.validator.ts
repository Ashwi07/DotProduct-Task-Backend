import { body } from "express-validator";

class CognitoValidator {
  checkUserCredentials() {
    return [
      body("username")
        .notEmpty()
        .withMessage("Username is required")
        .bail()
        .isEmail()
        .withMessage("Username must be an Email"),
      body("password")
        .trim()
        .notEmpty()
        .withMessage("Password cannot be empty"),
    ];
  }
}

export default new CognitoValidator();
