import express from "express";
import Helper from "../middlewares/helper";
import { transactionValidator } from "../middlewares/validators";
import { transactionController } from "../controllers";
import AuthMiddleware from "../middlewares/auth.middleware";

const router = express.Router();

//protected routes
router.use(AuthMiddleware.verifyToken);

/******************************* CRUD APIS START *******************************/
/**
 * @swagger
 * /api/transaction/{month}/{year}:
 *  get:
 *    summary: Get all Transaction
 *    tags: [Transaction]
 *    parameters:
 *      - in: path
 *        name: month
 *        required: true
 *        schema:
 *          type: number
 *        description: Transaction month
 *      - in: path
 *        name: year
 *        required: true
 *        schema:
 *          type: number
 *        description: Transaction year
 *      - in: query
 *        name: page
 *        required: false
 *        schema:
 *          type: integer
 *          default: 1
 *        description: Page Number
 *      - in: query
 *        name: limit
 *        required: false
 *        schema:
 *          type: integer
 *          default: 20
 *        description: Page size
 *      - in: query
 *        name: sort
 *        required: false
 *        schema:
 *          type: object
 *          default: {"amount": "ascend"}
 *        description: Sorts in amount and transactionDate
 *      - in: query
 *        name: searchTerm
 *        required: false
 *        schema:
 *          type: string
 *          default: Medicine
 *        description: Searches in name and description
 *      - in: query
 *        name: filter
 *        required: false
 *        schema:
 *          type: object
 *          default: {"categpry": ["Expense"]}
 *        description: Filters the category and subType as provided
 *    security:
 *      - BearerAuth: []
 *    responses:
 *      200:
 *        description: Transaction List
 *      401:
 *        description: Invalid Token
 *      500:
 *        description: Server Error
 */
//get all
router.get(
  "/:month/:year",
  transactionValidator.checkGetAll(),
  Helper.handleValidationError,
  transactionController.getAll
);

/**
 * @swagger
 * /api/transaction/{id}:
 *  get:
 *    summary: Get Transaction by ID
 *    tags: [Transaction]
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *        description: Transaction ID
 *    security:
 *      - BearerAuth: []
 *    responses:
 *      200:
 *        description: Transaction Fetched
 *      401:
 *        description: Invalid Token
 *      404:
 *        description: Transaction not found
 *      500:
 *        description: Server Error
 */
//get by id
router.get(
  "/:id",
  transactionValidator.checkId(),
  Helper.handleValidationError,
  transactionController.getById
);

/**
 * @swagger
 * /api/transaction:
 *  post:
 *    summary: Create Transaction
 *    tags: [Transaction]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - name
 *              - category
 *              - amount
 *              - subType
 *              - transactionDate
 *            properties:
 *              name:
 *                type: string
 *                example: Travel
 *              description:
 *                type: string
 *                example: Holiday trip to Italy
 *              category:
 *                type: string
 *                enum: [Income, Expense, Savings]
 *                example: Expense
 *              subType:
 *                type: string
 *                example: Other
 *              amount:
 *                type: number
 *                minimum: 1
 *                example: 10000
 *              transactionDate:
 *                type: string
 *                format: date
 *                example: 2025-05-10
 *    security:
 *      - BearerAuth: []
 *    responses:
 *      200:
 *        description: Transaction Created
 *      404:
 *        description: Category not found
 *      422:
 *        description: Transaction already exists in db
 *      500:
 *        description: Server Error
 */
//create
router.post(
  "/",
  transactionValidator.checkCreateTransaction(),
  Helper.handleValidationError,
  transactionController.create
);

/**
 * @swagger
 * /api/transaction/{id}:
 *  put:
 *    summary: Update Transaction by ID
 *    tags: [Transaction]
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *        description: Transaction ID
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              category:
 *                type: string
 *                example: Groceries
 *              description:
 *                type: string
 *                example: Food expenditure for month
 *              amount:
 *                type: number
 *                minimum: 1
 *                example: 10000
 *              month:
 *                type: number
 *                minimum: 0
 *                maximum: 11
 *                example: 10
 *              year:
 *                type: number
 *                minimum: 1000
 *                maximum: 9999
 *                example: 2025
 *    security:
 *      - BearerAuth: []
 *    responses:
 *      200:
 *        description: Transaction Updated
 *      400:
 *        description: Failed to update Transaction
 *      401:
 *        description: Invalid Token
 *      404:
 *        description: |
 *          Possible Cases:
 *          - Transaction not found
 *          - Catgory not found
 *      500:
 *        description: Server Error
 */
//update
router.put(
  "/:id",
  transactionValidator.checkUpdateTransaction(),
  Helper.handleValidationError,
  transactionController.update
);

/**
 * @swagger
 * /api/transaction/{id}:
 *  delete:
 *    summary: Delete Transaction by ID
 *    tags: [Transaction]
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *        description: Transaction ID
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
 *        description: Transaction Deleted
 *      401:
 *        description: Invalid Token
 *      404:
 *        description: Transaction not found
 *      500:
 *        description: Server Error
 */
//delete
router.delete(
  "/:id",
  transactionValidator.checkId(),
  Helper.handleValidationError,
  transactionController.remove
);
/******************************* CRUD APIS END *******************************/
export default router;
