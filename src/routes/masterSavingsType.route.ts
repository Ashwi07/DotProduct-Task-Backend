import express from "express";
import Helper from "../middlewares/helper";
import { masterSavingsTypeValidator } from "../middlewares/validators";
import { masterSavingsTypeController } from "../controllers";
import AuthMiddleware from "../middlewares/auth.middleware";

const router = express.Router();

//protected routes
router.use(AuthMiddleware.verifyToken);

/******************************* CRUD APIS START *******************************/
/**
 * @swagger
 * /api/master-savings-type:
 *  get:
 *    summary: Get all Master Savings Type
 *    tags: [Master Savings Type]
 *    security:
 *      - BearerAuth: []
 *    responses:
 *      200:
 *        description: Master Savings List
 *      401:
 *        description: Invalid Token
 *      500:
 *        description: Server Error
 */
//get all
router.get("/", masterSavingsTypeController.getAll);

/**
 * @swagger
 * /api/master-savings-type/{id}:
 *  get:
 *    summary: Get Master Savings Type by ID
 *    tags: [Master Savings Type]
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *        description: Master Savings Type ID
 *    security:
 *      - BearerAuth: []
 *    responses:
 *      200:
 *        description: Master Savings Type Fetched
 *      401:
 *        description: Invalid Token
 *      404:
 *        description: Master Savings Type not found
 *      500:
 *        description: Server Error
 */
//get by id
router.get(
  "/:id",
  masterSavingsTypeValidator.checkId(),
  Helper.handleValidationError,
  masterSavingsTypeController.getById
);

/**
 * @swagger
 * /api/master-savings-type:
 *  post:
 *    summary: Create Master Savings Type
 *    tags: [Master Savings Type]
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
 *                example: FD
 *    security:
 *      - BearerAuth: []
 *    responses:
 *      200:
 *        description: Master Savings Type Created
 *      422:
 *        description: Master Savings Type already exists in db
 *      500:
 *        description: Server Error
 */
//create
router.post(
  "/",
  masterSavingsTypeValidator.checkCreateMasterSavingsType(),
  Helper.handleValidationError,
  masterSavingsTypeController.create
);

/**
 * @swagger
 * /api/master-savings-type/{id}:
 *  put:
 *    summary: Update Master Savings Type by ID
 *    tags: [Master Savings Type]
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *        description: Master Savings Type ID
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *                example: FD
 *    security:
 *      - BearerAuth: []
 *    responses:
 *      200:
 *        description: Master Savings Type Updated
 *      400:
 *        description: Failed to update Master Savings Type
 *      401:
 *        description: Invalid Token
 *      404:
 *        description: Master Savings Type not found
 *      500:
 *        description: Server Error
 */
//update
router.put(
  "/:id",
  masterSavingsTypeValidator.checkUpdateMasterSavingsType(),
  Helper.handleValidationError,
  masterSavingsTypeController.update
);

/**
 * @swagger
 * /api/master-savings-type/{id}:
 *  delete:
 *    summary: Delete Master Savings Type by ID
 *    tags: [Master Savings Type]
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *        description: Master Savings Type ID
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
 *        description: Master Savings Type Deleted
 *      401:
 *        description: Invalid Token
 *      404:
 *        description: Master Savings Type not found
 *      500:
 *        description: Server Error
 */
//delete
router.delete(
  "/:id",
  masterSavingsTypeValidator.checkId(),
  Helper.handleValidationError,
  masterSavingsTypeController.remove
);
/******************************* CRUD APIS END *******************************/

export default router;
