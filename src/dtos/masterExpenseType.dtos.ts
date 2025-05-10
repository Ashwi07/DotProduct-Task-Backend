export interface addMasterExpenseTypeDTO {
  name: string;
}

export interface editMasterExpenseTypeDTO {
  name?: string;
  isDeleted?: boolean;
}

export interface checkMasterExpenseTypeDTO {
  _id?: string;
  name?: string | { $nin: string[] };
  isDeleted?: boolean;
}
