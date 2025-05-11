import mongoose from "mongoose";

export interface IMasterIncomeType {
  _id: mongoose.Types.ObjectId;
  name: string;
  isDeleted: boolean;
}

const MasterIncomeTypeSchema = new mongoose.Schema(
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
MasterIncomeTypeSchema.index(
  {
    name: 1,
  },
  {
    unique: true,
    partialFilterExpression: { isDeleted: false },
  }
);

export default mongoose.model<IMasterIncomeType>(
  "MasterIncomeType",
  MasterIncomeTypeSchema
);
