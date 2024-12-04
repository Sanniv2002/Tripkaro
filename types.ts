export interface Participant {
  id: string;
  name: string | null;
  createdAt: Date;
  updatedAt: Date;
  email: string | null;
  emailVerified: Date | null;
  avatar: string | null;
  viewName: string | null;
}

export interface Expense {
  id: string;
  amount: number;
  description: string;
  // etc.
}

export interface Trip {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  participants: Participant[];
  expenses: Expense[];
  roomCode: string;
}

export interface ExpenseEvent {
  id: string;
  title: string;
  amount: number;
  tripId: string;
}

export interface UserJoinedEvent {
  user: string;
  roomId: string;
}

export type SSEEventData = ExpenseEvent | UserJoinedEvent;
