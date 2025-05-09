import { masterIncomeTypeModel } from "../db/models";
import {
  addMasterIncomeTypeDTO,
  checkMasterIncomeTypeDTO,
  editMasterIncomeTypeDTO,
} from "../dtos/masterIncomeType.dtos";

class MasterIncomeTypeService {
  /************************** CRUD SERVICES START **************************/
  static async getAll() {
    return await masterIncomeTypeModel
      .find({ isDeleted: false })
      .sort({ createdAt: -1 });
  }

  static async getById(id: string) {
    return await masterIncomeTypeModel.findOne({ _id: id, isDeleted: false });
  }

  static async create(createObject: addMasterIncomeTypeDTO) {
    return await masterIncomeTypeModel.create(createObject);
  }

  static async update(id: string, updateObject: editMasterIncomeTypeDTO) {
    return await masterIncomeTypeModel.findByIdAndUpdate(id, updateObject, {
      new: true,
    });
  }

  static async remove(id: string) {
    return await masterIncomeTypeModel.findByIdAndUpdate(id, {
      isDeleted: true,
    });
  }

  static async delete(id: string) {
    return await masterIncomeTypeModel.findByIdAndDelete(id);
  }
  /************************** CRUD SERVICES END **************************/

  /************************** HELPER SERVICES START **************************/
  static async checkData(checkData: checkMasterIncomeTypeDTO) {
    return await masterIncomeTypeModel.findOne(checkData);
  }
  /************************** HELPER SERVICES END **************************/
}

export default MasterIncomeTypeService;
