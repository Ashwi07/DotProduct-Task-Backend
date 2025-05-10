import express from "express";
import Helper from "../middlewares/helper";
import { budgetValidator } from "../middlewares/validators";
import { budgetController } from "../controllers";
import AuthMiddleware from "../middlewares/auth.middleware";

const router = express.Router();

//protected routes
router.use(AuthMiddleware.verifyToken);

/******************************* CRUD APIS START *******************************/
/**
 * @swagger
 * /api/budget/{month}/{year}:
 *  get:
 *    summary: Get all Budget
 *    tags: [Budget]
 *    parameters:
 *      - in: path
 *        name: month
 *        required: true
 *        schema:
 *          type: number
 *        description: Budget month
 *      - in: path
 *        name: year
 *        required: true
 *        schema:
 *          type: number
 *        description: Budget year
 *    security:
 *      - BearerAuth: []
 *    responses:
 *      200:
 *        description: Budget List
 *      401:
 *        description: Invalid Token
 *      500:
 *        description: Server Error
 */
//get all
router.get(
  "/:month/:year",
  budgetValidator.checkGetAll(),
  Helper.handleValidationError,
  budgetController.getAll
);

/**
 * @swagger
 * /api/budget/{id}:
 *  get:
 *    summary: Get Budget by ID
 *    tags: [Budget]
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *        description: Budget ID
 *    security:
 *      - BearerAuth: []
 *    responses:
 *      200:
 *        description: Budget Fetched
 *      401:
 *        description: Invalid Token
 *      404:
 *        description: Budget not found
 *      500:
 *        description: Server Error
 */
//get by id
router.get(
  "/:id",
  budgetValidator.checkId(),
  Helper.handleValidationError,
  budgetController.getById
);

/**
 * @swagger
 * /api/budget:
 *  post:
 *    summary: Create Budget
 *    tags: [Budget]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - category
 *              - amount
 *              - month
 *              - year
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
 *        description: Budget Created
 *      404:
 *        description: Category not found
 *      422:
 *        description: Budget already exists in db
 *      500:
 *        description: Server Error
 */
//create
router.post(
  "/",
  budgetValidator.checkCreateBudget(),
  Helper.handleValidationError,
  budgetController.create
);

/**
 * @swagger
 * /api/budget/{id}:
 *  put:
 *    summary: Update Budget by ID
 *    tags: [Budget]
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *        description: Budget ID
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
 *        description: Budget Updated
 *      400:
 *        description: Failed to update Budget
 *      401:
 *        description: Invalid Token
 *      404:
 *        description: |
 *          Possible Cases:
 *          - Budget not found
 *          - Catgory not found
 *      500:
 *        description: Server Error
 */
//update
router.put(
  "/:id",
  budgetValidator.checkUpdateBudget(),
  Helper.handleValidationError,
  budgetController.update
);

/**
 * @swagger
 * /api/budget/{id}:
 *  delete:
 *    summary: Delete Budget by ID
 *    tags: [Budget]
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *        description: Budget ID
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
 *        description: Budget Deleted
 *      401:
 *        description: Invalid Token
 *      404:
 *        description: Budget not found
 *      500:
 *        description: Server Error
 */
//delete
router.delete(
  "/:id",
  budgetValidator.checkId(),
  Helper.handleValidationError,
  budgetController.remove
);
/******************************* CRUD APIS END *******************************/

/******************************* CUSTOM APIS START *******************************/
/**
 * @swagger
 * /api/budget/unused-budget-categories/{month}/{year}:
 *  get:
 *    summary: Get all Budget
 *    tags: [Budget]
 *    parameters:
 *      - in: path
 *        name: month
 *        required: true
 *        schema:
 *          type: number
 *        description: Budget month
 *      - in: path
 *        name: year
 *        required: true
 *        schema:
 *          type: number
 *        description: Budget year
 *    security:
 *      - BearerAuth: []
 *    responses:
 *      200:
 *        description: Budget List
 *      401:
 *        description: Invalid Token
 *      500:
 *        description: Server Error
 */
//get all
router.get(
  "/unused-budget-categories/:month/:year",
  budgetValidator.checkGetAll(),
  Helper.handleValidationError,
  budgetController.getUnusedBudgetCategories
);
/******************************* CUSTOM APIS END *******************************/
export default router;
