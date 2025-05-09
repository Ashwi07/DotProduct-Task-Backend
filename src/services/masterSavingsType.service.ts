import { masterSavingsTypeModel } from "../db/models";
import {
  addMasterSavingsTypeDTO,
  checkMasterSavingsTypeDTO,
  editMasterSavingsTypeDTO,
} from "../dtos/masterSavingsType.dtos";

class MasterSavingsTypeService {
  /************************** CRUD SERVICES START **************************/
  static async getAll() {
    return await masterSavingsTypeModel
      .find({ isDeleted: false })
      .sort({ createdAt: -1 });
  }

  static async getById(id: string) {
    return await masterSavingsTypeModel.findOne({ _id: id, isDeleted: false });
  }

  static async create(createObject: addMasterSavingsTypeDTO) {
    return await masterSavingsTypeModel.create(createObject);
  }

  static async update(id: string, updateObject: editMasterSavingsTypeDTO) {
    return await masterSavingsTypeModel.findByIdAndUpdate(id, updateObject, {
      new: true,
    });
  }

  static async remove(id: string) {
    return await masterSavingsTypeModel.findByIdAndUpdate(id, {
      isDeleted: true,
    });
  }

  static async delete(id: string) {
    return await masterSavingsTypeModel.findByIdAndDelete(id);
  }
  /************************** CRUD SERVICES END **************************/

  /************************** HELPER SERVICES START **************************/
  static async checkData(checkData: checkMasterSavingsTypeDTO) {
    return await masterSavingsTypeModel.findOne(checkData);
  }
  /************************** HELPER SERVICES END **************************/
}

export default MasterSavingsTypeService;
