import express from "express";
import { commonController } from "../controllers";
import AuthMiddleware from "../middlewares/auth.middleware";
import helper from "../middlewares/helper";
import { commonVaidator } from "../middlewares/validators";

const router = express.Router();

//protected routes
router.use(AuthMiddleware.verifyToken);

/******************************* CRUD APIS START *******************************/
/**
 * @swagger
 * /api/common/get-all-master:
 *  get:
 *    summary: Get all Master Data
 *    tags: [Common]
 *    security:
 *      - BearerAuth: []
 *    responses:
 *      200:
 *        description: List of all Master Data
 *      401:
 *        description: Invalid Token
 *      500:
 *        description: Server Error
 */
//get all
router.get("/get-all-master", commonController.getAllMaster);

/**
 * @swagger
 * /api/common/get-sub-types:
 *  get:
 *    summary: Get Sub Types
 *    tags: [Common]
 *    security:
 *      - BearerAuth: []
 *    responses:
 *      200:
 *        description: List of Sub Types
 *      401:
 *        description: Invalid Token
 *      500:
 *        description: Server Error
 */
//get all
router.get("/get-sub-types", commonController.getSubTypes);

/**
 * @swagger
 * /api/common/get-dashboard-details/{month}/{year}:
 *  get:
 *    summary: Get Dashboard
 *    parameters:
 *      - in: path
 *        name: month
 *        required: true
 *        schema:
 *          type: number
 *        description: Selected month
 *      - in: path
 *        name: year
 *        required: true
 *        schema:
 *          type: number
 *        description: Selected year
 *    tags: [Common]
 *    security:
 *      - BearerAuth: []
 *    responses:
 *      200:
 *        description: Dashboard Details
 *      401:
 *        description: Invalid Token
 *      500:
 *        description: Server Error
 */
//get all
router.get(
  "/get-dashboard-details/:month/:year",
  commonVaidator.checkGetDashboardDetails(),
  helper.handleValidationError,
  commonController.getDashboardDetails
);
/******************************* CRUD APIS END *******************************/

export default router;
