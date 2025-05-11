import { body, param } from "express-validator";

class TransactionValidator {
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

  checkCreateTransaction() {
    return [
      body("name")
        .trim()
        .notEmpty()
        .withMessage("Name is required")
        .bail()
        .isString()
        .withMessage("Name must be a string"),
      body("description")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Description is required")
        .bail()
        .isString()
        .withMessage("Description must be a string"),
      body("category")
        .trim()
        .notEmpty()
        .withMessage("Category is required")
        .bail()
        .isString()
        .withMessage("Category must be a string")
        .bail()
        .isIn(["Income", "Expense", "Savings"])
        .withMessage("Invalid Category"),
      body("subType")
        .trim()
        .notEmpty()
        .withMessage("Sub Type is required")
        .bail()
        .isString()
        .withMessage("Sub Type must be a string"),
      body("amount")
        .notEmpty()
        .withMessage("Amount is required")
        .bail()
        .isInt({ min: 1 })
        .withMessage("Amount must be greater than 0"),
      body("transactionDate")
        .trim()
        .notEmpty()
        .withMessage("Transaction Date is required")
        .bail()
        .isString()
        .withMessage("Transaction Date must be a string")
        .bail()
        .isDate()
        .withMessage("Transaction Date must be a date"),
    ];
  }

  checkUpdateTransaction() {
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
      body("description")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Description is required")
        .bail()
        .isString()
        .withMessage("Description must be a string"),
      body("category")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Category is required")
        .bail()
        .isString()
        .withMessage("Category must be a string"),
      body("subType")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Sub Type is required")
        .bail()
        .isString()
        .withMessage("Sub Type must be a string"),
      body("amount")
        .optional()
        .notEmpty()
        .withMessage("Amount is required")
        .bail()
        .isInt({ min: 1 })
        .withMessage("Amount must be greater than 0"),
      body("transactionDate")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Transaction Date is required")
        .bail()
        .isString()
        .withMessage("Transaction Date must be a string")
        .bail()
        .isDate()
        .withMessage("Transaction Date must be a date"),
    ];
  }
}

export default new TransactionValidator();
