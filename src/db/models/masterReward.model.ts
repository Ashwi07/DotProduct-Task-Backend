import mongoose from "mongoose";

export interface IMasterReward {
  _id: mongoose.Types.ObjectId;
  name: string;
  amount: number;
  isClaimed: boolean;
  isDeleted: boolean;
}

const MasterRewardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    isClaimed: {
      type: Boolean,
      default: false,
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

MasterRewardSchema.index(
  {
    name: 1,
  },
  {
    unique: true,
    partialFilterExpression: { isDeleted: false, isClaimed: false },
  }
);

export default mongoose.model<IMasterReward>(
  "MasterReward",
  MasterRewardSchema
);
