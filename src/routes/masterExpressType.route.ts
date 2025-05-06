import express from "express";
import Helper from "../middlewares/helper";
import { masterExpenseTypeValidator } from "../middlewares/validators";
import { masterExpenseTypeController } from "../controllers";
import AuthMiddleware from "../middlewares/auth.middleware";

const router = express.Router();

//protected routes
router.use(AuthMiddleware.verifyToken);

/******************************* CRUD APIS START *******************************/
//get all
router.get("/", masterExpenseTypeController.getAll);

//get by id
router.get(
  "/:id",
  masterExpenseTypeValidator.checkId(),
  Helper.handleValidationError,
  masterExpenseTypeController.getById
);

//create
router.post(
  "/",
  masterExpenseTypeValidator.checkCreateMasterExpenseType(),
  Helper.handleValidationError,
  masterExpenseTypeController.create
);

//update
router.put(
  "/:id",
  masterExpenseTypeValidator.checkUpdateMasterExpenseType(),
  Helper.handleValidationError,
  masterExpenseTypeController.update
);

//delete
router.delete(
  "/:id",
  masterExpenseTypeValidator.checkId(),
  Helper.handleValidationError,
  masterExpenseTypeController.remove
);
/******************************* CRUD APIS END *******************************/

export default router;
