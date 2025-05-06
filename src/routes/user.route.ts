import express from "express";
import Helper from "../middlewares/helper";
import { cognitoValidator, userValidator } from "../middlewares/validators";
import { userController } from "../controllers";
import AuthMiddleware from "../middlewares/auth.middleware";

const router = express.Router();
/******************************* COGNITO APIS START *******************************/

router.post(
  "/cognito/set-password",
  cognitoValidator.checkUserCredentials(),
  Helper.handleValidationError,
  userController.setCognitoUserPassword
);

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
//get all
router.get("/", userController.getAll);

//get by id
router.get(
  "/:id",
  userValidator.checkId(),
  Helper.handleValidationError,
  userController.getById
);

//create
router.post(
  "/",
  userValidator.checkCreateUser(),
  Helper.handleValidationError,
  userController.create
);

//update
router.put(
  "/:id",
  userValidator.checkUpdateUser(),
  Helper.handleValidationError,
  userController.update
);

//delete
router.delete(
  "/:id",
  userValidator.checkId(),
  Helper.handleValidationError,
  userController.remove
);
/******************************* CRUD APIS END *******************************/

export default router;
