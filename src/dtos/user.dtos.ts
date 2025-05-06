export interface addUserDTO {
  name: string;
  email: string;
  cognitoId: string;
}

export interface editUserDTO {
  name?: string;
  email?: string;
  cognitoId?: string;
  isDeleted?: boolean;
}

export interface checkUserDTO {
  _id?: string;
  name?: string;
  email?: string;
  cognitoId?: string;
  isDeleted?: boolean;
}
