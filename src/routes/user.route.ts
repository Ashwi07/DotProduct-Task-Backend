import express from "express";
import Helper from "../middlewares/helper";
import { cognitoValidator, userValidator } from "../middlewares/validators";
import { userController } from "../controllers";
import AuthMiddleware from "../middlewares/auth.middleware";

const router = express.Router();
/******************************* COGNITO APIS START *******************************/

/**
 * @swagger
 * /api/user/cognito/set-password:
 *  post:
 *    summary: Set Password
 *    tags: [Auth]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - username
 *              - password
 *            properties:
 *              username:
 *                type: string
 *                example: testuser123@gmail.com
 *              password:
 *                type: string
 *                example: Test@123
 *    responses:
 *      200:
 *        description: User password set
 *      404:
 *        description: User not found
 *      500:
 *        description: Server Error
 */
router.post(
  "/cognito/set-password",
  cognitoValidator.checkUserCredentials(),
  Helper.handleValidationError,
  userController.setCognitoUserPassword
);

/**
 * @swagger
 * /api/user/cognito/signin:
 *  post:
 *    summary: Sign-in (Copy token after running the api)
 *    tags: [Auth]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - username
 *              - password
 *            properties:
 *              username:
 *                type: string
 *                example: testuser123@gmail.com
 *              password:
 *                type: string
 *                example: Test@123
 *    responses:
 *      200:
 *        description: User Sign In
 *      401:
 *        description: Incorrect username or password
 *      404:
 *        description: User not found
 *      500:
 *        description: Server Error
 */
router.post(
  "/cognito/signin",
  cognitoValidator.checkUserCredentials(),
  Helper.handleValidationError,
  userController.cognitoSignin
);

/******************************* COGNITO APIS END *******************************/

//protected routes
router.use(AuthMiddleware.verifyToken);

/******************************* CRUD APIS START *******************************/

/**
 * @swagger
 * /api/user:
 *  get:
 *    summary: Get all users
 *    tags: [User]
 *    parameters:
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
 *    security:
 *      - BearerAuth: []
 *    responses:
 *      200:
 *        description: User List
 *      401:
 *        description: Invalid Token
 *      500:
 *        description: Server Error
 */
//get all
router.get("/", userController.getAll);

/**
 * @swagger
 * /api/user/{id}:
 *  get:
 *    summary: Get user by ID
 *    tags: [User]
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *        description: User ID
 *    security:
 *      - BearerAuth: []
 *    responses:
 *      200:
 *        description: User Fetched
 *      401:
 *        description: Invalid Token
 *      404:
 *        description: User not found
 *      500:
 *        description: Server Error
 */
//get by id
router.get(
  "/:id",
  userValidator.checkId(),
  Helper.handleValidationError,
  userController.getById
);

/**
 * @swagger
 * /api/user:
 *  post:
 *    summary: Create User
 *    tags: [User]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - name
 *              - email
 *            properties:
 *              name:
 *                type: string
 *                example: Test User
 *              email:
 *                type: string
 *                format: email
 *                example: testuser123@gmail.com
 *    security:
 *      - BearerAuth: []
 *    responses:
 *      200:
 *        description: User Created
 *      400:
 *        description: Failed to create user in cognito
 *      401:
 *        description: Invalid Token
 *      403:
 *        description: User already exists in cognito
 *      422:
 *        description: User already exists in db
 *      500:
 *        description: Server Error
 */
//create
router.post(
  "/",
  userValidator.checkCreateUser(),
  Helper.handleValidationError,
  userController.create
);

/**
 * @swagger
 * /api/user/{id}:
 *  put:
 *    summary: Update User by ID
 *    tags: [User]
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *        description: User ID
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *                example: Test User
 *    security:
 *      - BearerAuth: []
 *    responses:
 *      200:
 *        description: User Updated
 *      400:
 *        description: Failed to update user
 *      401:
 *        description: Invalid Token
 *      404:
 *        description: User not found
 *      500:
 *        description: Server Error
 */
//update
router.put(
  "/:id",
  userValidator.checkUpdateUser(),
  Helper.handleValidationError,
  userController.update
);

/**
 * @swagger
 * /api/user/{id}:
 *  delete:
 *    summary: Delete user by ID
 *    tags: [User]
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *        description: User ID
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
 *        description: User Deleted
 *      401:
 *        description: Invalid Token
 *      404:
 *        description: User not found
 *      500:
 *        description: Server Error
 */
//delete
router.delete(
  "/:id",
  userValidator.checkId(),
  Helper.handleValidationError,
  userController.remove
);
/******************************* CRUD APIS END *******************************/

export default router;
