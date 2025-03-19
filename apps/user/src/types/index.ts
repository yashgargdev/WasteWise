export interface WasteHistory {
  id: string;
  type: string;
  points: number;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  points?: number;
  wasteHistory?: WasteHistory[];
}
