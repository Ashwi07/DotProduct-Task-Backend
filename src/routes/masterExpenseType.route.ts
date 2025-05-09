import express from "express";
import Helper from "../middlewares/helper";
import { masterExpenseTypeValidator } from "../middlewares/validators";
import { masterExpenseTypeController } from "../controllers";
import AuthMiddleware from "../middlewares/auth.middleware";

const router = express.Router();

//protected routes
router.use(AuthMiddleware.verifyToken);

/******************************* CRUD APIS START *******************************/
/**
 * @swagger
 * /api/master-expense-type:
 *  get:
 *    summary: Get all Master Expense Type
 *    tags: [Master Expense Type]
 *    security:
 *      - BearerAuth: []
 *    responses:
 *      200:
 *        description: Master Expense List
 *      401:
 *        description: Invalid Token
 *      500:
 *        description: Server Error
 */
//get all
router.get("/", masterExpenseTypeController.getAll);

/**
 * @swagger
 * /api/master-expense-type/{id}:
 *  get:
 *    summary: Get Master Expense Type by ID
 *    tags: [Master Expense Type]
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *        description: Master Expense Type ID
 *    security:
 *      - BearerAuth: []
 *    responses:
 *      200:
 *        description: Master Expense Type Fetched
 *      401:
 *        description: Invalid Token
 *      404:
 *        description: Master Expense Type not found
 *      500:
 *        description: Server Error
 */
//get by id
router.get(
  "/:id",
  masterExpenseTypeValidator.checkId(),
  Helper.handleValidationError,
  masterExpenseTypeController.getById
);

/**
 * @swagger
 * /api/master-expense-type:
 *  post:
 *    summary: Create Master Expense Type
 *    tags: [Master Expense Type]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - name
 *            properties:
 *              name:
 *                type: string
 *                example: Loan
 *    security:
 *      - BearerAuth: []
 *    responses:
 *      200:
 *        description: Master Expense Type Created
 *      422:
 *        description: Master Expense Type already exists in db
 *      500:
 *        description: Server Error
 */
//create
router.post(
  "/",
  masterExpenseTypeValidator.checkCreateMasterExpenseType(),
  Helper.handleValidationError,
  masterExpenseTypeController.create
);

/**
 * @swagger
 * /api/master-expense-type/{id}:
 *  put:
 *    summary: Update Master Expense Type by ID
 *    tags: [Master Expense Type]
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *        description: Master Expense Type ID
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *                example: Loan
 *    security:
 *      - BearerAuth: []
 *    responses:
 *      200:
 *        description: Master Expense Type Updated
 *      400:
 *        description: Failed to update Master Expense Type
 *      401:
 *        description: Invalid Token
 *      404:
 *        description: Master Expense Type not found
 *      500:
 *        description: Server Error
 */
//update
router.put(
  "/:id",
  masterExpenseTypeValidator.checkUpdateMasterExpenseType(),
  Helper.handleValidationError,
  masterExpenseTypeController.update
);

/**
 * @swagger
 * /api/master-expense-type/{id}:
 *  delete:
 *    summary: Delete Master Expense Type by ID
 *    tags: [Master Expense Type]
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *        description: Master Expense Type ID
 *      - in: query
 *        name: hard
 *        required: false
 *        schema:
 *          type: boolean
 *          default: false
 *        description: set true for Hard delete
 *    security:
 *      - BearerAuth: []
 *    responses:
 *      200:
 *        description: Master Expense Type Deleted
 *      401:
 *        description: Invalid Token
 *      404:
 *        description: Master Expense Type not found
 *      500:
 *        description: Server Error
 */
//delete
router.delete(
  "/:id",
  masterExpenseTypeValidator.checkId(),
  Helper.handleValidationError,
  masterExpenseTypeController.remove
);
/******************************* CRUD APIS END *******************************/

export default router;
