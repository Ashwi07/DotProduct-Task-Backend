import express from "express";
import Helper from "../middlewares/helper";
import { masterRewardValidtor } from "../middlewares/validators";
import { masterRewardController } from "../controllers";
import AuthMiddleware from "../middlewares/auth.middleware";

const router = express.Router();

//protected routes
router.use(AuthMiddleware.verifyToken);

/******************************* CRUD APIS START *******************************/
/**
 * @swagger
 * /api/master-reward:
 *  get:
 *    summary: Get all Master Reward
 *    tags: [Master Reward]
 *    security:
 *      - BearerAuth: []
 *    responses:
 *      200:
 *        description: Master Reward List
 *      401:
 *        description: Invalid Token
 *      500:
 *        description: Server Error
 */
//get all
router.get("/", masterRewardController.getAll);

/**
 * @swagger
 * /api/master-reward/{id}:
 *  get:
 *    summary: Get Master Reward by ID
 *    tags: [Master Reward]
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *        description: Master Reward ID
 *    security:
 *      - BearerAuth: []
 *    responses:
 *      200:
 *        description: Master Reward Fetched
 *      401:
 *        description: Invalid Token
 *      404:
 *        description: Master Reward not found
 *      500:
 *        description: Server Error
 */
//get by id
router.get(
  "/:id",
  masterRewardValidtor.checkId(),
  Helper.handleValidationError,
  masterRewardController.getById
);

/**
 * @swagger
 * /api/master-reward:
 *  post:
 *    summary: Create Master Reward
 *    tags: [Master Reward]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - name
 *              - amount
 *            properties:
 *              name:
 *                type: string
 *                example: Candy
 *              amount:
 *                type: number
 *                minimum: 1
 *                example: 2000
 *    security:
 *      - BearerAuth: []
 *    responses:
 *      200:
 *        description: Master Reward Created
 *      422:
 *        description: Master Reward already exists in db
 *      500:
 *        description: Server Error
 */
//create
router.post(
  "/",
  masterRewardValidtor.checkCreateMasterReward(),
  Helper.handleValidationError,
  masterRewardController.create
);

/**
 * @swagger
 * /api/master-reward/{id}:
 *  put:
 *    summary: Update Master Reward by ID
 *    tags: [Master Reward]
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *        description: Master Reward ID
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *                example: Candy
 *              amount:
 *                type: number
 *                minimum: 1
 *                example: 2000
 *    security:
 *      - BearerAuth: []
 *    responses:
 *      200:
 *        description: Master Reward Updated
 *      400:
 *        description: Failed to update Master Reward
 *      401:
 *        description: Invalid Token
 *      404:
 *        description: Master Reward not found
 *      500:
 *        description: Server Error
 */
//update
router.put(
  "/:id",
  masterRewardValidtor.checkUpdateMasterReward(),
  Helper.handleValidationError,
  masterRewardController.update
);

/**
 * @swagger
 * /api/master-reward/{id}:
 *  delete:
 *    summary: Delete Master Reward by ID
 *    tags: [Master Reward]
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *        description: Master Reward ID
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
 *        description: Master Reward Deleted
 *      401:
 *        description: Invalid Token
 *      404:
 *        description: Master Reward not found
 *      500:
 *        description: Server Error
 */
//delete
router.delete(
  "/:id",
  masterRewardValidtor.checkId(),
  Helper.handleValidationError,
  masterRewardController.remove
);
/******************************* CRUD APIS END *******************************/

export default router;
