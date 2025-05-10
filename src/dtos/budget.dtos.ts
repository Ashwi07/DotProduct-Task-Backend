export interface addBudgetDTO {
  category: string;
  description?: string;
  amount: number;
  month: number;
  year: number;
}

export interface editBudgetDTO {
  category?: string;
  description?: string;
  amount?: number;
  month?: number;
  year?: number;
  isDeleted?: boolean;
}

export interface checkBudgetDTO {
  _id?: string;
  category?: string;
  description?: string;
  amount?: number;
  month?: number;
  year?: number;
  isDeleted?: boolean;
}

export interface sortBudgetDTO {
  createdAt?: 1 | -1;
  amount?: 1 | -1;
}
