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
      unique: true,
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

export default mongoose.model<IMasterExpenseType>(
  "MasterExpenseType",
  MasterExpenseTypeSchema
);
