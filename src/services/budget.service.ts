import { budgetModel } from "../db/models";
import {
  addBudgetDTO,
  checkBudgetDTO,
  editBudgetDTO,
  sortBudgetDTO,
} from "../dtos/budget.dtos";

class BudgetService {
  /************************** CRUD SERVICES START **************************/
  static async getAll(where: checkBudgetDTO, sort: sortBudgetDTO) {
    return await budgetModel
      .find({ ...where, isDeleted: false })
      .sort({ ...sort });
  }

  static async getById(id: string) {
    return await budgetModel.findOne({ _id: id, isDeleted: false });
  }

  static async create(createObject: addBudgetDTO) {
    return await budgetModel.create(createObject);
  }

  static async update(id: string, updateObject: editBudgetDTO) {
    return await budgetModel.findByIdAndUpdate(id, updateObject, {
      new: true,
    });
  }

  static async remove(id: string) {
    return await budgetModel.findByIdAndUpdate(id, {
      isDeleted: true,
    });
  }

  static async delete(id: string) {
    return await budgetModel.findByIdAndDelete(id);
  }
  /************************** CRUD SERVICES END **************************/

  /************************** HELPER SERVICES START **************************/
  static async checkData(checkData: checkBudgetDTO) {
    return await budgetModel.findOne(checkData);
  }

  static async getDistinctUsedCategories(where: checkBudgetDTO) {
    return await budgetModel.distinct("category", {
      ...where,
      isDeleted: false,
    });
  }

  static async getSum(where: checkBudgetDTO) {
    const result = await budgetModel.aggregate([
      {
        $match: { ...where, isDeleted: false },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" },
        },
      },
      {
        $project: {
          _id: 0,
          totalAmount: 1,
        },
      },
    ]);

    return result[0]?.totalAmount || 0;
  }

  static async getMonthData(where: checkBudgetDTO) {
    return await budgetModel.find({ ...where, isDeleted: false });
  }
  /************************** HELPER SERVICES END **************************/
}

export default BudgetService;
