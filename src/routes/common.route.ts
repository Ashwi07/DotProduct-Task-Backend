import express from "express";
import { commonController } from "../controllers";
import AuthMiddleware from "../middlewares/auth.middleware";

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
/******************************* CRUD APIS END *******************************/

export default router;
