export interface User {
  id: number;
  email: string;
  fullName: string;
}

export interface Ticket {
  id: number;
  code: string;
  zoneName: string;
  gate: string;
}
