import mongoose from "mongoose";

export interface ITransaction {
  _id: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  category: string;
  subType: string;
  amount: number;
  transactionDate: Date;
  isDeleted: boolean;
}

const TransactionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    category: {
      type: String,
      enum: ["Income", "Expense", "Savings"],
      required: true,
    },
    subType: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    transactionDate: {
      type: Date,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ITransaction>("Transaction", TransactionSchema);
