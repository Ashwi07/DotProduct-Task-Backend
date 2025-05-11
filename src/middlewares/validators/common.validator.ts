import { param } from "express-validator";

class CommonValidator {
  checkGetDashboardDetails() {
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
}

export default new CommonValidator();
