export interface addMasterIncomeTypeDTO {
    name: string;
  }
  
  export interface editMasterIncomeTypeDTO {
    name?: string;
    isDeleted?: boolean;
  }
  
  export interface checkMasterIncomeTypeDTO {
    _id?: string;
    name?: string;
    isDeleted?: boolean;
  }
  