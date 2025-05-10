import { body, param } from "express-validator";

class BudgetValidator {
  checkGetAll() {
    return [
      param("month")
        .notEmpty()
        .withMessage("Month is required")
        .bail()
        .isInt({ min: 0, max: 11 })
        .withMessage("Invalid Month"),
      param("year")
        .notEmpty()
        .withMessage("Year is required")
        .bail()
        .isInt({ min: 1000, max: 9999 })
        .withMessage("Invalid Year"),
    ];
  }

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

  checkCreateBudget() {
    return [
      body("category")
        .trim()
        .notEmpty()
        .withMessage("Category is required")
        .bail()
        .isString()
        .withMessage("Category must be a string"),
      body("description")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Description is required")
        .bail()
        .isString()
        .withMessage("Description must be a string"),
      body("amount")
        .notEmpty()
        .withMessage("Amount is required")
        .bail()
        .isInt({ min: 1 })
        .withMessage("Amount must be greater than 0"),
      body("month")
        .notEmpty()
        .withMessage("Month is required")
        .bail()
        .isInt({ min: 0, max: 11 })
        .withMessage("Invalid Month"),
      body("year")
        .notEmpty()
        .withMessage("Year is required")
        .bail()
        .isInt({ min: 1000, max: 9999 })
        .withMessage("Invalid Year"),
    ];
  }

  checkUpdateBudget() {
    return [
      param("id")
        .notEmpty()
        .withMessage("Id should not be empty")
        .bail()
        .isMongoId()
        .withMessage("Invalid Id"),
      body("category")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Category is required")
        .bail()
        .isString()
        .withMessage("Category must be a string"),
      body("description")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Description is required")
        .bail()
        .isString()
        .withMessage("Description must be a string"),
      body("amount")
        .optional()
        .notEmpty()
        .withMessage("Amount is required")
        .bail()
        .isInt({ min: 1 })
        .withMessage("Amount must be greater than 0"),
      body("month")
        .optional()
        .notEmpty()
        .withMessage("Month is required")
        .bail()
        .isInt({ min: 0, max: 11 })
        .withMessage("Invalid Month"),
      body("year")
        .optional()
        .notEmpty()
        .withMessage("Year is required")
        .bail()
        .isInt({ min: 1000, max: 9999 })
        .withMessage("Invalid Year"),
    ];
  }
}

export default new BudgetValidator();
