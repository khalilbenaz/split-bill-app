export interface Participant {
  id: string;
  name: string;
}

export interface Expense {
  id: string;
  label: string;
  amount: number;
  paidBy: string; // participant id
  sharedWith: string[]; // participant ids
  date: string; // ISO string
}

export interface AppState {
  participants: Participant[];
  expenses: Expense[];
}

export interface Balance {
  participantId: string;
  name: string;
  paid: number;
  owes: number;
  net: number; // paid - owes (positive = owed money, negative = owes money)
}

export interface Transfer {
  from: string; // participant name
  to: string; // participant name
  amount: number;
}
