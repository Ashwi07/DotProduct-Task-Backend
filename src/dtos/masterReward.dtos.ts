export interface addMasterRewardDTO {
  name: string;
  amount: number;
}

export interface editMasterRewardDTO {
  name?: string;
  amount?: number;
  isDeleted?: boolean;
}

export interface checkMasterRewardDTO {
  _id?: string;
  name?: string;
  amount?: number;
  isDeleted?: boolean;
}
