import mongoose from "mongoose";

export interface IBudget {
  _id: mongoose.Types.ObjectId;
  category: string;
  description?: string;
  amount: number;
  month: number;
  year: number;
  isDeleted: boolean;
}

const BudgetSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    amount: {
      type: Number,
      required: true,
    },
    month: {
      type: Number,
      required: true,
    },
    year: {
      type: Number,
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

BudgetSchema.index(
  {
    category: 1,
    month: 1,
    year: 1,
  },
  {
    unique: true,
    partialFilterExpression: { isDeleted: false },
  }
);

export default mongoose.model<IBudget>("Budget", BudgetSchema);
