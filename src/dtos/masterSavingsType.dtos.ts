export interface addMasterSavingsTypeDTO {
    name: string;
  }
  
  export interface editMasterSavingsTypeDTO {
    name?: string;
    isDeleted?: boolean;
  }
  
  export interface checkMasterSavingsTypeDTO {
    _id?: string;
    name?: string;
    isDeleted?: boolean;
  }
  