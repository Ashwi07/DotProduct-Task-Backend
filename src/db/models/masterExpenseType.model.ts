import mongoose from "mongoose";

export interface IMasterExpenseType {
  _id: mongoose.Types.ObjectId;
  name: string;
  isDeleted: boolean;
}

const MasterExpenseTypeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
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

// name must be unique for all non soft deleted data
MasterExpenseTypeSchema.index(
  {
    name: 1,
  },
  {
    unique: true,
    partialFilterExpression: { isDeleted: false },
  }
);

export default mongoose.model<IMasterExpenseType>(
  "MasterExpenseType",
  MasterExpenseTypeSchema
);
