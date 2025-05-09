import express from "express";
import Helper from "../middlewares/helper";
import { masterIncomeTypeValidator } from "../middlewares/validators";
import { masterIncomeTypeController } from "../controllers";
import AuthMiddleware from "../middlewares/auth.middleware";

const router = express.Router();

//protected routes
router.use(AuthMiddleware.verifyToken);

/******************************* CRUD APIS START *******************************/
/**
 * @swagger
 * /api/master-income-type:
 *  get:
 *    summary: Get all Master Income Type
 *    tags: [Master Income Type]
 *    security:
 *      - BearerAuth: []
 *    responses:
 *      200:
 *        description: Master Income List
 *      401:
 *        description: Invalid Token
 *      500:
 *        description: Server Error
 */
//get all
router.get("/", masterIncomeTypeController.getAll);

/**
 * @swagger
 * /api/master-income-type/{id}:
 *  get:
 *    summary: Get Master Income Type by ID
 *    tags: [Master Income Type]
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *        description: Master Income Type ID
 *    security:
 *      - BearerAuth: []
 *    responses:
 *      200:
 *        description: Master Income Type Fetched
 *      401:
 *        description: Invalid Token
 *      404:
 *        description: Master Income Type not found
 *      500:
 *        description: Server Error
 */
//get by id
router.get(
  "/:id",
  masterIncomeTypeValidator.checkId(),
  Helper.handleValidationError,
  masterIncomeTypeController.getById
);

/**
 * @swagger
 * /api/master-income-type:
 *  post:
 *    summary: Create Master Income Type
 *    tags: [Master Income Type]
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
 *                example: Business
 *    security:
 *      - BearerAuth: []
 *    responses:
 *      200:
 *        description: Master Income Type Created
 *      422:
 *        description: Master Income Type already exists in db
 *      500:
 *        description: Server Error
 */
//create
router.post(
  "/",
  masterIncomeTypeValidator.checkCreateMasterIncomeType(),
  Helper.handleValidationError,
  masterIncomeTypeController.create
);

/**
 * @swagger
 * /api/master-income-type/{id}:
 *  put:
 *    summary: Update Master Income Type by ID
 *    tags: [Master Income Type]
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *        description: Master Income Type ID
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *                example: Business
 *    security:
 *      - BearerAuth: []
 *    responses:
 *      200:
 *        description: Master Income Type Updated
 *      400:
 *        description: Failed to update Master Income Type
 *      401:
 *        description: Invalid Token
 *      404:
 *        description: Master Income Type not found
 *      500:
 *        description: Server Error
 */
//update
router.put(
  "/:id",
  masterIncomeTypeValidator.checkUpdateMasterIncomeType(),
  Helper.handleValidationError,
  masterIncomeTypeController.update
);

/**
 * @swagger
 * /api/master-income-type/{id}:
 *  delete:
 *    summary: Delete Master Income Type by ID
 *    tags: [Master Income Type]
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *        description: Master Income Type ID
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
 *        description: Master Income Type Deleted
 *      401:
 *        description: Invalid Token
 *      404:
 *        description: Master Income Type not found
 *      500:
 *        description: Server Error
 */
//delete
router.delete(
  "/:id",
  masterIncomeTypeValidator.checkId(),
  Helper.handleValidationError,
  masterIncomeTypeController.remove
);
/******************************* CRUD APIS END *******************************/

export default router;
