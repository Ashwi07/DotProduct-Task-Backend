import { masterRewardModel } from "../db/models";
import {
  addMasterRewardDTO,
  checkMasterRewardDTO,
  editMasterRewardDTO,
} from "../dtos/masterReward.dtos";

class MasterRewardService {
  /************************** CRUD SERVICES START **************************/
  static async getAll() {
    return await masterRewardModel
      .find({ isDeleted: false })
      .sort({ createdAt: -1 });
  }

  static async getById(id: string) {
    return await masterRewardModel.findOne({ _id: id, isDeleted: false });
  }

  static async create(createObject: addMasterRewardDTO) {
    return await masterRewardModel.create(createObject);
  }

  static async update(id: string, updateObject: editMasterRewardDTO) {
    return await masterRewardModel.findByIdAndUpdate(id, updateObject, {
      new: true,
    });
  }

  static async remove(id: string) {
    return await masterRewardModel.findByIdAndUpdate(id, {
      isDeleted: true,
    });
  }

  static async delete(id: string) {
    return await masterRewardModel.findByIdAndDelete(id);
  }
  /************************** CRUD SERVICES END **************************/

  /************************** HELPER SERVICES START **************************/
  static async checkData(checkData: checkMasterRewardDTO) {
    return await masterRewardModel.findOne(checkData);
  }
  /************************** HELPER SERVICES END **************************/
}

export default MasterRewardService;
