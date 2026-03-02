export interface User {
  id: number;
  email: string;
  fullName: string;
  hasTicket?: boolean;
  avoidStairs?: boolean;
  avoidCrowds?: boolean;
  avoidSlopes?: boolean;
  avoidGrandstands?: boolean;
}

export interface Ticket {
  id: number;
  code: string;
  zoneName: string;
  gate: string;
}
