import { body, param } from "express-validator";

class MasterIncomeTypeValidator {
  checkId() {
    return [
      param("id")
        .notEmpty()
        .withMessage("Id should not be empty")
        .bail()
        .isMongoId()
        .withMessage("Invalid Id"),
    ];
  }

  checkCreateMasterIncomeType() {
    return [
      body("name")
        .trim()
        .notEmpty()
        .withMessage("Name is required")
        .bail()
        .isString()
        .withMessage("Name must be a string"),
    ];
  }

  checkUpdateMasterIncomeType() {
    return [
      param("id")
        .notEmpty()
        .withMessage("Id should not be empty")
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
}

export default new MasterIncomeTypeValidator();
