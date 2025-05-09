import mongoose from "mongoose";

export interface IMasterReward {
  _id: mongoose.Types.ObjectId;
  name: string;
  amount: number;
  isDeleted: boolean;
}

const MasterRewardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    amount: {
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

export default mongoose.model<IMasterReward>(
  "MasterReward",
  MasterRewardSchema
);
