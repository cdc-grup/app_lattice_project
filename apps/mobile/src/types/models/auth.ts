export interface User {
  id: number;
  email: string;
  fullName: string;
  hasTicket?: boolean;
}

export interface Ticket {
  id: number;
  code: string;
  zoneName: string;
  gate: string;
}
