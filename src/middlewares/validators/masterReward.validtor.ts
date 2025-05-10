import { body, param } from "express-validator";

class MasterRewardValidator {
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

  checkCreateMasterReward() {
    return [
      body("name")
        .trim()
        .notEmpty()
        .withMessage("Name is required")
        .bail()
        .isString()
        .withMessage("Name must be a string"),
      body("amount")
        .notEmpty()
        .withMessage("Amount is required")
        .bail()
        .isInt({ min: 1 })
        .withMessage("Amount must be greater than 0"),
    ];
  }

  checkUpdateMasterReward() {
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
      body("amount")
        .optional()
        .notEmpty()
        .withMessage("Amount is required")
        .bail()
        .isInt({ min: 1 })
        .withMessage("Amount must be greater than 0"),
      body("isClaimed")
        .optional()
        .notEmpty()
        .withMessage("Claimed cannot be empty")
        .bail()
        .isBoolean()
        .withMessage("Claimed should be a boolean value"),
    ];
  }
}

export default new MasterRewardValidator();
