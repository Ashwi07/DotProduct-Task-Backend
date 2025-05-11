export interface addTransactionDTO {
  name: string;
  description?: string;
  category: string;
  subType: string;
  amount: number;
  transactionDate: Date;
}

export interface editTransactionDTO {
  name?: string;
  description?: string;
  category?: string;
  subType?: string;
  amount?: number;
  transactionDate?: Date;
  isDeleted?: boolean;
}

export interface checkTransactionDTO {
  _id?: string;
  name?: string;
  description?: string;
  category?: string | { $in: string[] };
  subType?: string | { $in: string[] };
  amount?: number;
  transactionDate?: Date | { $lt: Date; $gte: Date };
  isDeleted?: boolean;
}

export interface sortTransactionDTO {
  createdAt?: 1 | -1;
  amount?: 1 | -1;
  transactionDate?: 1 | -1;
}
export interface checkTransactionSearchTermDTO {
  $or?: orType[];
}

type orType = {
  name?: { $regex: RegExp };
  description?: { $regex: RegExp };
};
