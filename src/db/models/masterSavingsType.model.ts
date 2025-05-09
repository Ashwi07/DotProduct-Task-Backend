import mongoose from "mongoose";

export interface IMasterSavingsType {
  _id: mongoose.Types.ObjectId;
  name: string;
  isDeleted: boolean;
}

const MasterSavingsTypeSchema = new mongoose.Schema(
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

export default mongoose.model<IMasterSavingsType>(
  "MasterSavingsType",
  MasterSavingsTypeSchema
);
