import { masterExpenseTypeModel } from "../db/models";
import {
  addMasterExpenseTypeDTO,
  checkMasterExpenseTypeDTO,
  editMasterExpenseTypeDTO,
} from "../dtos/masterExpenseType.dtos";

class MasterExpenseTypeService {
  /************************** CRUD SERVICES START **************************/
  static async getAll(skip: number, limit: number) {
    return await masterExpenseTypeModel
      .find({ isDeleted: false })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
  }

  static async getById(id: string) {
    return await masterExpenseTypeModel.findOne({ _id: id, isDeleted: false });
  }

  static async create(createObject: addMasterExpenseTypeDTO) {
    return await masterExpenseTypeModel.create(createObject);
  }

  static async update(id: string, updateObject: editMasterExpenseTypeDTO) {
    return await masterExpenseTypeModel.findByIdAndUpdate(id, updateObject, {
      new: true,
    });
  }

  static async remove(id: string) {
    return await masterExpenseTypeModel.findByIdAndUpdate(id, {
      isDeleted: true,
    });
  }

  static async delete(id: string) {
    return await masterExpenseTypeModel.findByIdAndDelete(id);
  }
  /************************** CRUD SERVICES END **************************/

  /************************** HELPER SERVICES START **************************/
  static async checkData(checkData: checkMasterExpenseTypeDTO) {
    return await masterExpenseTypeModel.findOne(checkData);
  }
  /************************** HELPER SERVICES END **************************/
}

export default MasterExpenseTypeService;
