import { transactionModel } from "../db/models";
import {
  addTransactionDTO,
  checkTransactionDTO,
  checkTransactionSearchTermDTO,
  editTransactionDTO,
  sortTransactionDTO,
} from "../dtos/transaction.dtos";

class TransactionService {
  /************************** CRUD SERVICES START **************************/
  static async getAll(
    where: checkTransactionDTO,
    search: checkTransactionSearchTermDTO,
    sort: sortTransactionDTO,
    skip: number,
    limit: number
  ) {
    return await transactionModel
      .find({ ...where, ...search, isDeleted: false })
      .sort({ ...sort })
      .skip(skip)
      .limit(limit);
  }

  static async getById(id: string) {
    return await transactionModel.findOne({ _id: id, isDeleted: false });
  }

  static async create(createObject: addTransactionDTO) {
    return await transactionModel.create(createObject);
  }

  static async update(id: string, updateObject: editTransactionDTO) {
    return await transactionModel.findByIdAndUpdate(id, updateObject, {
      new: true,
    });
  }

  static async remove(id: string) {
    return await transactionModel.findByIdAndUpdate(id, {
      isDeleted: true,
    });
  }

  static async delete(id: string) {
    return await transactionModel.findByIdAndDelete(id);
  }
  /************************** CRUD SERVICES END **************************/

  /************************** HELPER SERVICES START **************************/
  static async checkData(checkData: checkTransactionDTO) {
    return await transactionModel.findOne(checkData);
  }

  static async getTotalCount(
    checkData: checkTransactionDTO,
    search: checkTransactionSearchTermDTO
  ) {
    return await transactionModel.countDocuments({
      ...checkData,
      ...search,
      isDeleted: false,
    });
  }

  static async getCategorizedSum(where: checkTransactionDTO) {
    const result = await transactionModel.aggregate([
      {
        $match: { ...where, isDeleted: false },
      },
      {
        $group: {
          _id: "$category",
          totalAmount: { $sum: "$amount" },
        },
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          totalAmount: 1,
        },
      },
    ]);

    const summary: Record<string, number> = {
      Income: 0,
      Savings: 0,
      Expense: 0,
    };

    result.forEach((item) => {
      summary[item.category] = item.totalAmount;
    });

    return summary;
  }

  static async getMonthData(where: checkTransactionDTO) {
    return await transactionModel.find({ ...where, isDeleted: false });
  }
  /************************** HELPER SERVICES END **************************/
}

export default TransactionService;
