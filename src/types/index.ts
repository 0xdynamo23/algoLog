export interface User {
  id?: string;
  email: string;
  name?: string;
  coins: number;
  solved: number;
  streak: number;
  themePurchased: boolean;
  leetcodeUsername?: string;
} 