import { userModel } from "../db/models";
import { addUserDTO, checkUserDTO, editUserDTO } from "../dtos/user.dtos";

class UserService {
  /************************** CRUD SERVICES START **************************/
  static async getAll(skip: number, limit: number) {
    return await userModel
      .find({ isDeleted: false })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
  }

  static async getById(id: string) {
    return await userModel.findOne({ _id: id, isDeleted: false });
  }

  static async create(createObject: addUserDTO) {
    return await userModel.create(createObject);
  }

  static async update(id: string, updateObject: editUserDTO) {
    return await userModel.findByIdAndUpdate(id, updateObject, {
      new: true,
    });
  }

  static async remove(id: string) {
    return await userModel.findByIdAndUpdate(id, {
      isDeleted: true,
    });
  }

  static async delete(id: string) {
    return await userModel.findByIdAndDelete(id);
  }
  /************************** CRUD SERVICES END **************************/

  /************************** HELPER SERVICES START **************************/
  static async checkData(checkData: checkUserDTO) {
    return await userModel.findOne(checkData);
  }
  /************************** HELPER SERVICES END **************************/
}

export default UserService;
